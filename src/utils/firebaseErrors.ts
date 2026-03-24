export function getFirebaseAuthMessage(error: any): string {
    const code = error?.code || "";
  
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
  
      case "auth/user-not-found":
        return "No account was found with that email address.";
  
      case "auth/email-already-in-use":
        return "This email is already in use. Please log in or use another email.";
  
      case "auth/weak-password":
        return "Password is too weak. Please use at least 6 characters.";
  
      case "auth/invalid-credential":
        return "Invalid email or password.";
  
      case "auth/missing-password":
        return "Please enter your password.";
  
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
  
      default:
        return "Something went wrong. Please try again.";
    }
  }