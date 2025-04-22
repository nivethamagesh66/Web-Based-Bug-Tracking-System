import { Routes, Route } from "react-router-dom"; // ✅ no BrowserRouter here
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import ManageUsers from "./pages/ManageUsers";
import AddProgram from "./pages/AddProgram";
import EditProgram from "./pages/EditProgram";
import ManagePrograms from "./pages/ManagePrograms";
import AddFunctionalArea from "./pages/AddFunctionalArea";
import EditFunctionalArea from "./pages/EditFunctionalArea";
import ManageFunctionalAreas from "./pages/ManageFunctionalAreas";
import ReportBug from "./pages/ReportBug";
import ViewBugs from "./pages/ViewBugs";
import EditBug from "./pages/EditBug";
import BugHistory from "./pages/BugHistory";




function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={[3]} />} />
      <Route path="/user-dashboard" element={<ProtectedRoute element={<UserDashboard />} allowedRoles={[1, 2]} />} />
      <Route path="/add-user" element={<ProtectedRoute element={<AddUser />} allowedRoles={[3]} />} />
      <Route path="/edit-user/:id" element={<ProtectedRoute element={<EditUser />} allowedRoles={[3]} />} />
      <Route path="/manage-users" element={<ProtectedRoute element={<ManageUsers />} allowedRoles={[3]} />} />
      <Route path="/add-program" element={<ProtectedRoute element={<AddProgram />} allowedRoles={[3]} />} />
      <Route path="/edit-program/:id" element={<ProtectedRoute element={<EditProgram />} allowedRoles={[3]} />} />
      <Route path="/manage-programs" element={<ProtectedRoute element={<ManagePrograms />} allowedRoles={[3]} />} />
      <Route path="/add-area" element={<ProtectedRoute element={<AddFunctionalArea />} allowedRoles={[3]} />} />
      <Route path="/edit-area/:id" element={<ProtectedRoute element={<EditFunctionalArea />} allowedRoles={[3]} />} />
      <Route path="/manage-functional-areas" element={<ProtectedRoute element={<ManageFunctionalAreas />} allowedRoles={[3]} />} />
      <Route path="/report-bug" element={<ProtectedRoute element={<ReportBug />} allowedRoles={[1, 2]} />} />
      <Route path="/view-bugs" element={<ProtectedRoute element={<ViewBugs />} allowedRoles={[1, 2, 3]} />} />
      <Route path="/edit-bug/:id" element={<ProtectedRoute element={<EditBug />} allowedRoles={[3]} />} />
<Route path="/bug-history/:id" element={<ProtectedRoute element={<BugHistory />} allowedRoles={[1, 2, 3]} />} />
    </Routes>
  );
}

export default App;
