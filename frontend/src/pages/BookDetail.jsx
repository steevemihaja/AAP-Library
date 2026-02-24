import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { StarIcon } from '@heroicons/react/20/solid';
import { 
    CalendarIcon, 
    UserIcon, 
    BookOpenIcon,
    ClockIcon 
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ReviewList from '../../components/Reviews/ReviewList';
import ReviewForm from '../../components/Reviews/ReviewForm';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const BookDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showReviewForm, setShowReviewForm] = useState(false);

    const { data, isLoading, error } = useQuery(
        ['book', id],
        () => api.get(`/books/${id}`)
    );

    const borrowMutation = useMutation(
        (data) => api.post('/borrowings', data),
        {
            onSuccess: () => {
                toast.success('Book borrowed successfully!');
                queryClient.invalidateQueries(['book', id]);
            },
            onError: (error) => {
                toast.error(error.response?.data?.error || 'Failed to borrow book');
            }
        }
    );

    const handleBorrow = () => {
        borrowMutation.mutate({
            bookId: id,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
        });
    };

    if (isLoading) return <LoadingSpinner />;
    
    if (error || !data?.data?.data) {
        return (
            <div className="text-center text-red-600 py-8">
                Error loading book details.
            </div>
        );
    }

    const book = data.data.data;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    {/* Book Cover */}
                    <div className="md:w-1/3 p-6 bg-gray-50">
                        <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                            {book.coverImage ? (
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <BookOpenIcon className="h-24 w-24 text-gray-400" />
                                </div>
                            )}
                        </div>
                        
                        {user && (
                            <button
                                onClick={handleBorrow}
                                disabled={book.availableCopies === 0 || borrowMutation.isLoading}
                                className={`mt-4 w-full py-3 px-4 rounded-lg font-medium ${
                                    book.availableCopies > 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {borrowMutation.isLoading ? 'Processing...' : 'Borrow This Book'}
                            </button>
                        )}
                    </div>

                    {/* Book Details */}
                    <div className="md:w-2/3 p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {book.title}
                        </h1>
                        
                        <p className="text-xl text-gray-600 mb-4">
                            by {book.author}
                        </p>
                        
                        <div className="flex items-center mb-6">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className={`h-5 w-5 ${
                                            i < Math.floor(book.averageRating)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-gray-600">
                                {book.averageRating.toFixed(1)} ({book.totalReviews} reviews)
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center text-gray-600">
                                <BookOpenIcon className="h-5 w-5 mr-2" />
                                <span>
                                    {book.availableCopies} of {book.totalCopies} available
                                </span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                                <CalendarIcon className="h-5 w-5 mr-2" />
                                <span>Published: {book.publishedYear}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                                <UserIcon className="h-5 w-5 mr-2" />
                                <span>Publisher: {book.publisher}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-600">
                                <ClockIcon className="h-5 w-5 mr-2" />
                                <span>Language: {book.language}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Genres</h2>
                            <div className="flex flex-wrap gap-2">
                                {book.genres.map(genre => (
                                    <span
                                        key={genre}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {book.description && (
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Description</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {book.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Reviews</h2>
                    {user && !showReviewForm && (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Write a Review
                        </button>
                    )}
                </div>

                {showReviewForm && (
                    <div className="mb-6">
                        <ReviewForm
                            bookId={id}
                            onSuccess={() => {
                                setShowReviewForm(false);
                                queryClient.invalidateQueries(['book', id]);
                            }}
                            onCancel={() => setShowReviewForm(false)}
                        />
                    </div>
                )}

                <ReviewList bookId={id} />
            </div>
        </div>
    );
};

export default BookDetail;