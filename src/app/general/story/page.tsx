"use client";

import React, { useState } from "react";
import { X, Eye, Edit2, Trash2, Plus, Calendar, Clock } from "lucide-react";

interface IStory {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: number;
  status: "active" | "inactive";
  expiryDate: string;
  createdAt: string;
}

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  duration: number;
  expiryDate: string;
}

const StoryManager: React.FC = () => {
  const [stories, setStories] = useState<IStory[]>([
    {
      _id: "1",
      title: "Summer Adventure 2024",
      description:
        "A thrilling journey through the mountains and valleys, exploring nature at its finest.",
      imageUrl:
        "https://images.unsplash.com/photo-1762912302731-508b4580735f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      duration: 15,
      status: "active",
      expiryDate: "2025-12-31",
      createdAt: "2024-01-15",
    },
    {
      _id: "2",
      title: "City Lights",
      description:
        "Experience the vibrant nightlife and stunning architecture of metropolitan cities.",
      imageUrl:
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400",
      duration: 10,
      status: "active",
      expiryDate: "2025-11-30",
      createdAt: "2024-02-20",
    },
    {
      _id: "3",
      title: "Ocean Dreams",
      description:
        "Dive into the deep blue sea and discover the wonders beneath the waves.",
      imageUrl:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      duration: 12,
      status: "inactive",
      expiryDate: "2025-10-15",
      createdAt: "2024-03-10",
    },
    {
      _id: "4",
      title: "Desert Wanderer",
      description:
        "Journey through endless dunes and witness breathtaking desert sunsets.",
      imageUrl:
        "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400",
      duration: 8,
      status: "active",
      expiryDate: "2025-09-20",
      createdAt: "2024-04-05",
    },
    {
      _id: "5",
      title: "Forest Whispers",
      description:
        "Get lost in the enchanting beauty of ancient forests and their hidden secrets.",
      imageUrl:
        "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
      duration: 20,
      status: "active",
      expiryDate: "2026-01-31",
      createdAt: "2024-05-12",
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    imageUrl: "",
    duration: 10,
    expiryDate: "",
  });

  const [editingStory, setEditingStory] = useState<IStory | null>(null);
  const [viewingStory, setViewingStory] = useState<IStory | null>(null);
  const [deletingStory, setDeletingStory] = useState<IStory | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // edit image upload
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStory: IStory = {
      _id: Date.now().toString(),
      ...formData,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setStories((prev) => [newStory, ...prev]);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      duration: 10,
      expiryDate: "",
    });
    setShowForm(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    setStories((prev) =>
      prev.map((story) =>
        story._id === editingStory._id ? editingStory : story
      )
    );
    setEditingStory(null);
  };

  const handleDelete = () => {
    if (!deletingStory) return;
    setStories((prev) =>
      prev.filter((story) => story._id !== deletingStory._id)
    );
    setDeletingStory(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pb-3">
            Story Management
          </h1>
          <p className="text-gray-600 text-lg">
            Create, manage, and organize your stories
          </p>
        </div>

        {/* Add Story Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Plus size={24} />
            {showForm ? "Cancel" : "Add New Story"}
          </button>
        </div>

        {/* Add Story Form */}
        {showForm && (
          //   <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-purple-100">
          //     <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          //       <Plus className="text-purple-600" size={32} />
          //       Create New Story
          //     </h2>
          //     <div className="space-y-6">
          //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          //         <div>
          //           <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
          //           <input
          //             type="text"
          //             name="title"
          //             value={formData.title}
          //             onChange={handleInputChange}
          //             maxLength={100}
          //             required
          //             className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          //             placeholder="Enter story title"
          //           />
          //         </div>
          //         <div>
          //           <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (seconds) *</label>
          //           <input
          //             type="number"
          //             name="duration"
          //             value={formData.duration}
          //             onChange={handleInputChange}
          //             required
          //             className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          //             placeholder="10"
          //           />
          //         </div>
          //       </div>

          //       <div>
          //         <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
          //         <textarea
          //           name="description"
          //           value={formData.description}
          //           onChange={handleInputChange}
          //           maxLength={200}
          //           required
          //           rows={3}
          //           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          //           placeholder="Enter story description (max 200 characters)"
          //         />
          //       </div>

          //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          //         <div>
          //           <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
          //           <input
          //             type="url"
          //             name="imageUrl"
          //             value={formData.imageUrl}
          //             onChange={handleInputChange}
          //             required
          //             className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          //             placeholder="https://example.com/image.jpg"
          //           />
          //         </div>
          //         <div>
          //           <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
          //           <input
          //             type="date"
          //             name="expiryDate"
          //             value={formData.expiryDate}
          //             onChange={handleInputChange}
          //             required
          //             className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          //           />
          //         </div>
          //       </div>

          //       <button
          //         onClick={handleSubmit}
          //         className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          //       >
          //         Create Story
          //       </button>
          //     </div>
          //   </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              {/* <Plus className="text-blue-600" size={32} /> */}
              Create New Story
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={100}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter story title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (seconds) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={200}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter story description (max 200 characters)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Story Image <span className="text-red-500">*</span>
                  </label>

                  <div className="w-full">
                    {/* Preview Section */}
                    {formData.imageUrl ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-blue-400 shadow-md">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />

                        {/* Remove Image Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imageUrl: "" });
                            setImageFile(null);
                          }}
                          className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 text-xs rounded-lg hover:bg-black/70"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      /* Upload Box */
                      <label className="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-all bg-gray-50">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M3 16.5l3.97-3.97a2.25 2.25 0 013.18 0L15 17m-5.25-4.5l1.06-1.06a2.25 2.25 0 013.18 0L21 17M9 7.5a2.25 2.25 0 114.5 0A2.25 2.25 0 019 7.5z"
                            />
                          </svg>

                          <p className="text-gray-600 font-medium mt-2">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, JPEG
                          </p>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setFormData({
                                ...formData,
                                imageUrl: URL.createObjectURL(file),
                              });
                              setImageFile(file);
                            }
                          }}
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                Create Story
              </button>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100"
            >
              <div className="relative h-56 overflow-hidden group">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      story.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {story.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {story.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {story.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{story.duration}s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {new Date(story.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewingStory(story)}
                    className="flex-1 bg-[#3397E9] hover:bg-blue-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => setEditingStory({ ...story })}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit2 size={16} />
                    Update
                  </button>
                  <button
                    onClick={() => setDeletingStory(story)}
                    className="flex-1 bg-[#e7000b] hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Modal */}
        {viewingStory && (
          <div className="fixed inset-0 bg-[#ffffff7c] bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-3xl font-bold text-gray-800">
                  Story Details
                </h2>
                <button
                  onClick={() => setViewingStory(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-6">
                <img
                  src={viewingStory.imageUrl}
                  alt={viewingStory.title}
                  className="w-full h-80 object-cover rounded-2xl mb-6 shadow-lg"
                />

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Title
                    </label>
                    <p className="text-xl font-bold text-gray-800 mt-1">
                      {viewingStory.title}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Description
                    </label>
                    <p className="text-gray-700 mt-1">
                      {viewingStory.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Duration
                      </label>
                      <p className="text-lg font-bold text-gray-800 mt-1">
                        {viewingStory.duration} seconds
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </label>
                      <p className="mt-1">
                        <span
                          className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                            viewingStory.status === "active"
                              ? "bg-green-500 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {viewingStory.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Expiry Date
                      </label>
                      <p className="text-lg font-bold text-gray-800 mt-1">
                        {new Date(viewingStory.expiryDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Created
                      </label>
                      <p className="text-lg font-bold text-gray-800 mt-1">
                        {new Date(viewingStory.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Image URL
                    </label>
                    <p className="text-blue-600 mt-1 break-all">
                      {viewingStory.imageUrl}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingStory && (
          <div className="fixed inset-0 bg-[#ffffff8c] bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-3xl font-bold text-gray-800">
                  Update Story
                </h2>
                <button
                  onClick={() => setEditingStory(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingStory.title}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        title: e.target.value,
                      })
                    }
                    maxLength={100}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={editingStory.description}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        description: e.target.value,
                      })
                    }
                    maxLength={200}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={editingStory.imageUrl}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        imageUrl: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div> */}

                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Image Upload Section */}
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload New Image *
                    </label>

                    {/* Show selected new image */}
                    {newImagePreview ? (
                      <div className="relative h-48 rounded-xl overflow-hidden border shadow">
                        <img
                          src={newImagePreview}
                          className="w-full h-full object-cover"
                        />
                        <button
                          className="absolute top-2 right-2 bg-black/60 text-white text-xs px-3 py-1 rounded-lg"
                          onClick={() => {
                            setNewImagePreview(null);
                            setNewImageFile(null);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      /* Upload Box */
                      <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 bg-gray-50 transition">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M3 16.5l3.97-3.97a2.25 2.25 0 013.18 0L15 17m-5.25-4.5l1.06-1.06a2.25 2.25 0 013.18 0L21 17M9 7.5a2.25 2.25 0 114.5 0A2.25 2.25 0 019 7.5z"
                          />
                        </svg>
                        <p className="text-gray-600 mt-2 font-medium">
                          Click to upload
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, JPEG</p>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const file = e.target.files[0];
                              setNewImageFile(file);
                              setNewImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Previous Image Section */}
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Previous Image
                    </label>

                    <div className="h-48 rounded-xl border overflow-hidden shadow">
                      <img
                        src={editingStory.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (seconds) *
                    </label>
                    <input
                      type="number"
                      value={editingStory.duration}
                      onChange={(e) =>
                        setEditingStory({
                          ...editingStory,
                          duration: parseInt(e.target.value),
                        })
                      }
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={editingStory.status}
                      onChange={(e) =>
                        setEditingStory({
                          ...editingStory,
                          status: e.target.value as "active" | "inactive",
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={editingStory.expiryDate}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        expiryDate: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingStory(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-semibold text-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                  >
                    Update Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingStory && (
          <div className="fixed inset-0 bg-[#ffffff73] bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="text-red-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Delete Story?
                </h2>
                <p className="text-gray-600 mb-2">
                  Are you sure you want to delete
                </p>
                <p className="text-lg font-semibold text-gray-800 mb-6">
                  &quot;{deletingStory.title}&quot;?
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  This action cannot be undone.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setDeletingStory(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryManager;
