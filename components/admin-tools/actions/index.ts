import { toast } from "@/hooks/use-toast";
import {
  createAdminAccount,
  createHistory,
  createManagementAccount,
  createUserAccount,
} from "@/components/admin-tools/admin-tools";

export async function handleCreateAdminAccount() {
  toast({ description: "Please wait while we create an admin account" });
  const res = await createAdminAccount({});
  if (res?.success) {
    toast({ description: `Email: admin@gmail.com Password:User1234!` });
  } else {
    toast({ description: res?.error, variant: "destructive" });
  }
}

export async function handleCreateUserAccount() {
  toast({ description: "Please wait while we create a user account" });
  const res = await createUserAccount({
    email: "user_test@gmail.com",
    name: "user test",
  });
  if (res?.success) {
    toast({ description: `Email: user_test@gmail.com Password:User1234!` });
  } else {
    toast({ description: res?.error, variant: "destructive" });
  }
}

export async function handleCreateManagmentAccount() {
  toast({ description: "Please wait while we create a management account" });
  const res = await createManagementAccount({
    email: "management_test@gmail.com",
    name: "management test",
  });
  if (res?.success) {
    toast({
      description: `Email: management_test@gmail.com Password:User1234!`,
    });
  } else {
    toast({ description: res?.error, variant: "destructive" });
  }
}

export async function handleCreateHistory({
  user,
  management,
  date,
}: {
  user: string;
  management: string;
  date: Date;
}) {
  toast({ description: "Please wait while we create a history" });
  const res = await createHistory({
    user,
    management,
    date,
  });
  if (res?.success) {
    toast({
      description: res.success,
    });
  } else {
    toast({ description: res?.error, variant: "destructive" });
  }
}
