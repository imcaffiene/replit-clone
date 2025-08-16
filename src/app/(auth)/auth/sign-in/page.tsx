import { SignInForm } from "@/features/auth/components/SignInForm";
import Image from "next/image";

const SignInPage = () => {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={150}
        height={150}
      />
      <SignInForm />
    </div>
  );
};

export default SignInPage;
