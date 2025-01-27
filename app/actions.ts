"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TTodo } from "@/types/todo.type";
import { revalidatePath } from "next/cache";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const getCurrentUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return user;
}

export const getAllTodos = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('todos').select();

  if (error) {
    console.error(error.message);
    return [];
  }

  return data as TTodo[];
}

export const addTodo = async(title: string) => {
  const supabase = await createClient();

  if (!title.trim()) {
    throw new Error("User ID and title are required to add a todo.");
  }

  const { data, error } = await supabase
    .from("todos")
    .insert([{ title: title.trim(), created_at: new Date().toISOString() }])
    .select();

  if (error) {
    console.error("Error adding todo:", error.message);
    throw new Error("Failed to add todo.");
  }

  revalidatePath("/");
  return data[0] as TTodo;
}

export const updateTodo = async (todoId: string, payload: {is_completed?: boolean, title?: string}) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("todos")
    .update(payload)
    .eq("id", todoId);

  if (error) {
    console.error("Error updating status todo:", error.message);
    throw new Error("Failed to updating status todo.");
  }

  revalidatePath("/");
}

export const deleteTodo = async (todoId: string) => { 
  const supabase = await createClient();

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", todoId);

  if (error) {
    console.error("Error deleting todo:", error.message);
    throw new Error("Failed to delete todo.");
  }

  revalidatePath("/");
}
