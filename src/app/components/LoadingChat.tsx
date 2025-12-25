'use client';

export default function LoadingChat() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
                {/* Green Spinner */}
                <div className="mx-auto mb-6 w-16 h-16">
                    <div className="w-full h-full border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Loading your chats
                </h3>

                {/* Typing Dots */}
                <div className="flex justify-center gap-2 my-4">
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce delay-150"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce delay-300"></div>
                </div>

                <p className="text-sm text-gray-500">
                    Please wait a moment...
                </p>
            </div>
        </div>
    );
}