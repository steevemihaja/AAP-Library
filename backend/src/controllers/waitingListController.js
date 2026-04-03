const WaitingList = require('../models/WaitingList');
const Book = require('../models/Book');

exports.joinWaitingList = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ success: false, error: 'Livre introuvable' });

        const existing = await WaitingList.findOne({ user: userId, book: bookId, status: 'waiting' });
        if (existing) return res.status(400).json({ success: false, error: 'Déjà dans la liste d\'attente' });

        const lastEntry = await WaitingList.findOne({ book: bookId, status: 'waiting' }).sort({ position: -1 });
        const position = lastEntry ? lastEntry.position + 1 : 1;

        const entry = await WaitingList.create({ user: userId, book: bookId, position });
        await entry.populate('book', 'title author coverImage');

        res.status(201).json({ success: true, message: 'Ajouté à la liste d\'attente', data: entry });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.leaveWaitingList = async (req, res) => {
    try {
        const entry = await WaitingList.findOne({ _id: req.params.id, user: req.user._id });
        if (!entry) return res.status(404).json({ success: false, error: 'Entrée introuvable' });

        const { book: bookId, position: cancelledPosition } = entry;
        entry.status = 'cancelled';
        await entry.save();

        await WaitingList.updateMany(
            { book: bookId, status: 'waiting', position: { $gt: cancelledPosition } },
            { $inc: { position: -1 } }
        );

        res.json({ success: true, message: 'Retiré de la liste d\'attente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMyWaitingList = async (req, res) => {
    try {
        const list = await WaitingList.find({ user: req.user._id, status: 'waiting' })
            .populate('book', 'title author coverImage availableCopies')
            .sort({ createdAt: 1 });

        res.json({ success: true, data: list, total: list.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getWaitingListByBook = async (req, res) => {
    try {
        const list = await WaitingList.find({ book: req.params.bookId, status: 'waiting' })
            .populate('user', 'firstName lastName email')
            .sort({ position: 1 });

        res.json({ success: true, data: list, total: list.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};