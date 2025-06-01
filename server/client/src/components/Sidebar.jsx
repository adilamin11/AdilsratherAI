import React from "react";
import { LogOut, X, Plus, MessageSquare, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Sidebar({ onClose, onNewChat }) {  // Added onNewChat prop
  const user = JSON.parse(localStorage.getItem("user"));
  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "https://adilsai.onrender.com/api/v1/user/logout",
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert(data.message);
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.errors || "Logout Failed");
    }
  };

  return (
    <div className="h-full flex flex-col justify-between bg-gray-800/90 backdrop-blur-md border-r border-gray-700/30">
      {/* Header - Now clearly visible */}
      <div className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-xl font-bold text-white">AdilsAI</span> {/* Changed to solid white */}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Working New Chat Button */}
        <div className="p-4">
          <button 
            onClick={onNewChat}  // Now properly connected
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <MessageSquare className="w-10 h-10 text-gray-500 mb-3" />
          <p className="text-gray-400 text-sm">No chat history yet</p>
          <p className="text-gray-500 text-xs mt-1">Start a new conversation</p>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-sm p-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition cursor-pointer mb-3">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=7c3aed&color=fff`}
            alt="profile"
            className="rounded-full w-9 h-9"
          />
          <div>
            <p className="text-gray-200 font-medium">
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-gray-300 hover:text-white text-sm px-3 py-2.5 rounded-lg hover:bg-gray-700/50 transition"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;