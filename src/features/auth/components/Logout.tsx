import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LogoutProps {
  children?: React.ReactNode;
}

export default function Logout({ children }: LogoutProps) {

  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <span className="cursor-pointer" onClick={handleLogout}>
      {children}
    </span>
  );
}