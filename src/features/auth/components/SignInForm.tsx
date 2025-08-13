import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChromeIcon, GithubIcon } from "lucide-react";

export const SignInForm = () => {
  return (
    <Card className='w-full max-w-sm mx-auto [&>*]:items-center'>
      <CardHeader className='space-y-1 text-center'>
        <CardTitle className='text-2xl font-bold'>Sign In</CardTitle>
        <CardDescription>Choose Your Preferred Sign-in Method</CardDescription>
      </CardHeader>

      <CardContent className='grid gap-4'>
        <Button
          variant='outline'
          className='w-full'>
          <ChromeIcon className='mr-2 h-4 w-4' />
          <span>Sign in with Google</span>
        </Button>

        <Button
          variant='outline'
          className='w-full'>
          <GithubIcon className='mr-2 h-4 w-4' />
          <span>Sign in with Github</span>
        </Button>
      </CardContent>

      <div className='px-6 pb-6 text-center'>
        <p className='text-xs text-muted-foreground'>
          By signing in, you agree to our{" "}
          <a
            href='#'
            className='underline underline-offset-4 hover:text-primary'>
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href='#'
            className='underline underline-offset-4 hover:text-primary'>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </Card>
  );
};
