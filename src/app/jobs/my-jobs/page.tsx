"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, MapPin, Building2, Banknote, Clock,
    Pencil, Trash2, Plus, X, Loader2, AlertTriangle,
    CheckCircle, XCircle, Timer
} from "lucide-react";
import { IJob } from "@/types/job";

const STATUS_CONFIG = {
    approved: { label: "Approved", icon: CheckCircle, className: "bg-green-50 text-green-700 border-green-200" },
    pending:  { label: "Pending",  icon: Timer,        className: "bg-amber-50 text-amber-700 border-amber-200" },
    rejected: { label: "Rejected", icon: XCircle,      className: "bg-red-50 text-red-700 border-red-200" },
};

export default function MyJobsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const isLoggedIn = !!(session as any)?.accessToken;

    const [jobs, setJobs] = useState<IJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editJob, setEditJob] = useState<IJob | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    // Edit form state
    const [form, setForm] = useState({
        title: "", companyName: "", location: "",
        category: "", salaryRange: "", description: "",
        contactEmail: "", contactPhone: "",
    });

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/");
            return;
        }
        fetchMyJobs();
    }, [isLoggedIn]);

    const fetchMyJobs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/v1/job/my-jobs");
            setJobs(data.data || []);
        } catch {
            toast.error("Failed to load your jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleEditOpen = (job: IJob) => {
        setEditJob(job);
        setForm({
            title: job.title,
            companyName: job.companyName,
            location: job.location,
            category: job.category,
            salaryRange: job.salaryRange || "",
            description: job.description,
            contactEmail: job.contactEmail,
            contactPhone: job.contactPhone,
        });
    };

    const handleEditSubmit = async () => {
        if (!editJob) return;
        setEditLoading(true);
        try {
            await axios.patch(`/api/v1/job/${editJob._id}/edit`, form);
            toast.success("Job updated! It will be re-reviewed.");
            setEditJob(null);
            fetchMyJobs();
        } catch {
            toast.error("Failed to update job");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await axios.delete(`/api/v1/job/${deleteId}/edit`);
            toast.success("Job deleted successfully");
            setDeleteId(null);
            setJobs((prev) => prev.filter((j) => j._id !== deleteId));
        } catch {
            toast.error("Failed to delete job");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="md:max-w-[95vw] xl:container sm:px-8 mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
                        <p className="mt-1 text-gray-500">Manage your posted job listings</p>
                    </div>
                    <Link
                        href="/jobs/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00005E] text-white font-semibold rounded-lg hover:bg-[#000045] transition-colors text-sm shadow"
                    >
                        <Plus className="w-4 h-4" /> Post New Job
                    </Link>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <Loader2 className="w-8 h-8 animate-spin text-[#00005E]" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No jobs posted yet</h3>
                        <p className="mt-2 text-sm text-gray-500">Post your first job to get started.</p>
                        <Link href="/jobs/create" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#00005E] text-white font-semibold rounded-lg text-sm">
                            <Plus className="w-4 h-4" /> Post a Job
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {jobs.map((job) => {
                            const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.pending;
                            const StatusIcon = statusCfg.icon;
                            return (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            {/* Status + Category */}
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold border ${statusCfg.className}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {statusCfg.label}
                                                </span>
                                                <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold border border-blue-100">
                                                    {job.category}
                                                </span>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(job.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>

                                            <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>

                                            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Building2 className="w-4 h-4 text-gray-400" /> {job.companyName}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-gray-400" /> {job.location}
                                                </span>
                                                {job.salaryRange && (
                                                    <span className="flex items-center gap-1.5 text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
                                                        <Banknote className="w-4 h-4" /> {job.salaryRange}
                                                    </span>
                                                )}
                                            </div>

                                            {job.status === 'pending' && (
                                                <p className="mt-2 text-xs text-amber-600 bg-amber-50 inline-flex items-center gap-1 px-2 py-1 rounded">
                                                    <Timer className="w-3.5 h-3.5" /> Under review — will be visible after approval
                                                </p>
                                            )}
                                            {job.status === 'rejected' && (
                                                <p className="mt-2 text-xs text-red-600 bg-red-50 inline-flex items-center gap-1 px-2 py-1 rounded">
                                                    <AlertTriangle className="w-3.5 h-3.5" /> Rejected — edit and resubmit for review
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex md:flex-col gap-2 justify-end items-end">
                                            <button
                                                onClick={() => handleEditOpen(job)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold rounded-lg transition-all text-sm"
                                            >
                                                <Pencil className="w-4 h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(job._id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-semibold rounded-lg transition-all text-sm"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ===================== */}
            {/* Delete Confirm Modal  */}
            {/* ===================== */}
            <AnimatePresence>
                {deleteId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDeleteId(null)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
                        >
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-7 h-7 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete this job?</h3>
                            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteId(null)}
                                    className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:border-gray-300 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} disabled={deleting}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ===================== */}
            {/* Edit Modal            */}
            {/* ===================== */}
            <AnimatePresence>
                {editJob && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setEditJob(null)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                <h3 className="text-lg font-bold text-gray-900">Edit Job</h3>
                                <button onClick={() => setEditJob(null)}
                                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="p-6 space-y-4">
                                {[
                                    { label: "Job Title", key: "title", type: "text" },
                                    { label: "Company Name", key: "companyName", type: "text" },
                                    { label: "Location", key: "location", type: "text" },
                                    { label: "Category", key: "category", type: "text" },
                                    { label: "Salary Range", key: "salaryRange", type: "text" },
                                    { label: "Contact Email", key: "contactEmail", type: "email" },
                                    { label: "Contact Phone", key: "contactPhone", type: "text" },
                                ].map(({ label, key, type }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                                        <input
                                            type={type}
                                            value={(form as any)[key]}
                                            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00005E] focus:border-transparent"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00005E] focus:border-transparent resize-none"
                                    />
                                </div>

                                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg flex items-center gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                    After editing, the job will go back to Pending review.
                                </p>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setEditJob(null)}
                                        className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:border-gray-300 transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={handleEditSubmit} disabled={editLoading}
                                        className="flex-1 py-3 bg-[#00005E] hover:bg-[#000045] text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                                        {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}