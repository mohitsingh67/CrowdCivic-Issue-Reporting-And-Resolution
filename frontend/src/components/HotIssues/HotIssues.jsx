import { useState, useEffect } from 'react';
import { Flame, ThumbsUp } from 'lucide-react';
import { reportsAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

export default function HotIssues() {
  const navigate = useNavigate();
  const [hotReports, setHotReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotReports();
  }, []);

  const fetchHotReports = async () => {
    try {
      const response = await reportsAPI.getReports({ isHot: true, sortBy: 'likes' });
      setHotReports(response.data);
    } catch (error) {
      console.error('Error fetching hot reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reportId, e) => {
    e.stopPropagation();
    try {
      await reportsAPI.toggleLike(reportId);
      fetchHotReports();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Flame className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-900">Hot Issues</h2>
      </div>

      {hotReports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hot issues at the moment. Like reports to make them hot!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hotReports.map((report) => (
            <div
              key={report._id}
              onClick={() => navigate(`/report/${report._id}`)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex-1">{report.title}</h3>
                <button
                  onClick={(e) => handleLike(report._id, e)}
                  className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors ml-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{report.likes || 0}</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
              <div className="text-xs text-gray-500">
                {report.category} • {report.priority} • {new Date(report.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { useState, useEffect } from 'react';
// import { Flame, ThumbsUp, List } from 'lucide-react';
// import { reportsAPI } from '../../utils/api';
// import { useNavigate } from 'react-router-dom';

// export default function HotIssues() {
//   const navigate = useNavigate();

//   const [hotReports, setHotReports] = useState([]);
//   const [allReports, setAllReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortByLikes, setSortByLikes] = useState(false);

//   useEffect(() => {
//     fetchReports();
//   }, [sortByLikes]);

//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       // Hot reports: filtered isHot = true, sorted by likes
//       const hotResp = await reportsAPI.getReports({ isHot: true, sortBy: 'likes' });
//       setHotReports(hotResp.data || []);

//       // All reports: sorted by likes or recent
//       const allResp = await reportsAPI.getReports({ sortBy: sortByLikes ? 'likes' : 'createdAt' });
//       setAllReports(allResp.data || []);
//     } catch (err) {
//       console.error('Error fetching reports:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLike = async (reportId, e) => {
//     e.stopPropagation();
//     try {
//       await reportsAPI.toggleLike(reportId);
//       fetchReports(); // refresh both lists
//     } catch (err) {
//       console.error('Error toggling like:', err);
//     }
//   };

//   if (loading) return <div className="text-center py-8">Loading...</div>;

//   return (
//     <div className="flex gap-6">
//       {/* Hot Issues */}
//       <div className="flex-1">
//         <div className="flex items-center space-x-2 mb-4">
//           <Flame className="w-5 h-5 text-orange-500" />
//           <h2 className="text-lg font-semibold">Hot Issues</h2>
//         </div>

//         {hotReports.length === 0 ? (
//           <p className="text-gray-500">No hot issues at the moment.</p>
//         ) : (
//           <div className="space-y-3">
//             {hotReports.map((report) => (
//               <div
//                 key={report._id}
//                 onClick={() => navigate(`/report/${report._id}`)}
//                 className="border p-4 rounded-lg hover:shadow cursor-pointer"
//               >
//                 <div className="flex justify-between items-center mb-1">
//                   <h3 className="font-medium">{report.title}</h3>
//                   <button
//                     onClick={(e) => handleLike(report._id, e)}
//                     className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 rounded-full"
//                   >
//                     <ThumbsUp className="w-4 h-4" />
//                     <span>{report.likes || 0}</span>
//                   </button>
//                 </div>
//                 <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {report.category} • {report.priority} • {new Date(report.createdAt).toLocaleDateString()}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Sidebar: All Issues */}
//       <div className="w-1/3 border-l border-gray-200 pl-4">
//         <div className="flex justify-between items-center mb-3">
//           <h2 className="flex items-center gap-2 font-semibold">
//             <List className="w-5 h-5" />
//             All Issues
//           </h2>
//           <button
//             onClick={() => setSortByLikes(!sortByLikes)}
//             className="text-sm px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
//           >
//             Sort by {sortByLikes ? 'Recent' : 'Likes'}
//           </button>
//         </div>

//         <div className="space-y-2 max-h-[70vh] overflow-y-auto">
//           {allReports.length === 0 ? (
//             <p className="text-gray-500 text-sm">No reports found.</p>
//           ) : (
//             allReports.map((report) => (
//               <div
//                 key={report._id}
//                 onClick={() => navigate(`/report/${report._id}`)}
//                 className="border rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
//               >
//                 <div className="flex justify-between items-center">
//                   <h4 className="text-sm font-medium">{report.title}</h4>
//                   <div className="flex items-center gap-1 text-gray-500 text-xs">
//                     <ThumbsUp className="w-3 h-3" />
//                     {report.likes || 0}
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 line-clamp-2">{report.description}</p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
//////////////////////////////////////////////////
// import { useState, useEffect } from 'react';
// import { Flame, ThumbsUp, List } from 'lucide-react';
// import { reportsAPI } from '../../utils/api';
// import { useNavigate } from 'react-router-dom';

// export default function HotIssues({ userId }) {
//   const navigate = useNavigate();

//   const [hotReports, setHotReports] = useState([]);
//   const [allReports, setAllReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     sortBy: 'createdAt', // 'likes' or 'createdAt'
//     category: '',
//     location: ''
//   });

//   // Fetch reports when filters change
//   useEffect(() => {
//     fetchReports();
//   }, [filters]);

//   const fetchReports = async () => {
//     setLoading(true);
//     try {
//       // Hot Issues (likes >= threshold, sorted by likes descending)
//       const hotResp = await reportsAPI.getReports({ isHot: true, sortBy: 'likes' });
//       setHotReports(hotResp.data || []);

//       // All Issues with filters
//       const query = {
//         sortBy: filters.sortBy,
//         category: filters.category || undefined,
//         location: filters.location || undefined
//       };
//       const allResp = await reportsAPI.getReports(query);
//       setAllReports(allResp.data || []);
//     } catch (err) {
//       console.error('Error fetching reports:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle like for a report
//   const handleLike = async (reportId, e) => {
//     e.stopPropagation();
//     try {
//       const response = await reportsAPI.toggleLike(reportId, userId); // backend updates likes
//       const updatedLikes = response.data.likes;

//       // Update local state for hotReports
//       setHotReports((prev) =>
//         prev.map((r) => (r._id === reportId ? { ...r, likes: updatedLikes } : r))
//       );

//       // Update local state for allReports
//       setAllReports((prev) =>
//         prev.map((r) => (r._id === reportId ? { ...r, likes: updatedLikes } : r))
//       );
//     } catch (err) {
//       console.error('Error toggling like:', err);
//     }
//   };

//   if (loading) return <div className="text-center py-8">Loading...</div>;

//   return (
//     <div className="flex gap-6">
//       {/* Hot Issues */}
//       <div className="flex-1">
//         <div className="flex items-center space-x-2 mb-4">
//           <Flame className="w-5 h-5 text-orange-500" />
//           <h2 className="text-lg font-semibold">Hot Issues</h2>
//         </div>

//         {hotReports.length === 0 ? (
//           <p className="text-gray-500">No hot issues at the moment.</p>
//         ) : (
//           <div className="space-y-3">
//             {hotReports
//               .sort((a, b) => b.likes - a.likes) // rank by likes
//               .map((report) => (
//                 <div
//                   key={report._id}
//                   onClick={() => navigate(`/report/${report._id}`)}
//                   className="border p-4 rounded-lg hover:shadow cursor-pointer"
//                 >
//                   <div className="flex justify-between items-center mb-1">
//                     <h3 className="font-medium">{report.title}</h3>
//                     <button
//                       onClick={(e) => handleLike(report._id, e)}
//                       className={`flex items-center gap-1 px-2 py-1 rounded-full ${
//                         report.likedBy?.includes(userId)
//                           ? 'bg-orange-500 text-white'
//                           : 'bg-orange-100 text-orange-600'
//                       }`}
//                     >
//                       <ThumbsUp className="w-4 h-4" />
//                       <span>{report.likes || 0}</span>
//                     </button>
//                   </div>
//                   <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
//                   <div className="text-xs text-gray-500 mt-1">
//                     {report.category} • {report.priority} •{' '}
//                     {new Date(report.createdAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>

//       {/* Sidebar: All Issues */}
//       <div className="w-1/3 border-l border-gray-200 pl-4">
//         <div className="flex justify-between items-center mb-3">
//           <h2 className="flex items-center gap-2 font-semibold">
//             <List className="w-5 h-5" />
//             All Issues
//           </h2>
//           <select
//             className="text-sm px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
//             value={filters.sortBy}
//             onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
//           >
//             <option value="createdAt">Recent</option>
//             <option value="likes">Most Liked</option>
//           </select>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-2 mb-3">
//           <input
//             type="text"
//             placeholder="Category"
//             className="flex-1 border px-2 py-1 rounded"
//             value={filters.category}
//             onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             className="flex-1 border px-2 py-1 rounded"
//             value={filters.location}
//             onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
//           />
//         </div>

//         <div className="space-y-2 max-h-[70vh] overflow-y-auto">
//           {allReports.length === 0 ? (
//             <p className="text-gray-500 text-sm">No reports found.</p>
//           ) : (
//             allReports.map((report) => (
//               <div
//                 key={report._id}
//                 onClick={() => navigate(`/report/${report._id}`)}
//                 className="border rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
//               >
//                 <div className="flex justify-between items-center">
//                   <h4 className="text-sm font-medium">{report.title}</h4>
//                   <div className="flex items-center gap-1 text-gray-500 text-xs">
//                     <ThumbsUp className="w-3 h-3" />
//                     {report.likes || 0}
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 line-clamp-2">{report.description}</p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
