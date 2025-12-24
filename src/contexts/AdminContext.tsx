import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { checkIsOrganizer } from "@/services/adminService";

interface AdminContextType {
  isOrganizer: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isOrganizer: false,
  loading: true,
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsOrganizer(false);
        setLoading(false);
        return;
      }

      const hasRole = await checkIsOrganizer(user.id);
      setIsOrganizer(hasRole);
      setLoading(false);
    };

    checkRole();
  }, [user]);

  return (
    <AdminContext.Provider value={{ isOrganizer, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
