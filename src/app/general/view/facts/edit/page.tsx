import React from 'react';

export default function page() {
  return <div></div>;
}

//   return (
//     <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6">
//       <h4 className="text-xl font-semibold mb-4">Edit Fact</h4>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Fact Title */}
//           <div className="space-y-2">
//             <Label htmlFor="factTitle">
//               Fact Title <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="factTitle"
//               type="text"
//               value={fact.factTitle}
//               onChange={e => setFact({ ...fact, factTitle: e.target.value })}
//               required
//             />
//           </div>

//           {/* Fact Count */}
//           <div className="space-y-2">
//             <Label htmlFor="factCount">Fact Count</Label>
//             <Input
//               id="factCount"
//               type="number"
//               value={fact.factCount}
//               onChange={e =>
//                 setFact({ ...fact, factCount: Number(e.target.value) })
//               }
//             />
//           </div>
//         </div>

//         {/* Short Description */}
//         <div className="space-y-2">
//           <Label htmlFor="shortDescription">Short Description</Label>
//           <Textarea
//             id="shortDescription"
//             rows={3}
//             maxLength={250}
//             value={fact.shortDescription}
//             onChange={e =>
//               setFact({ ...fact, shortDescription: e.target.value })
//             }
//           />
//         </div>

//         {/* Status */}
//         <div className="w-40 space-y-2">
//           <Label htmlFor="status">Status</Label>
//           <Select
//             value={fact.status}
//             onValueChange={val => setFact({ ...fact, status: val })}>
//             <SelectTrigger id="status">
//               <SelectValue placeholder="Select One" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Submit Button */}
//         <div className="pt-4">
//           <Button type="submit" disabled={loading} className="w-full md:w-auto">
//             {loading ? 'Updating...' : 'Update'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
