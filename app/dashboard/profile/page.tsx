"use client"

import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = () => {
    toast({
      title: "Feature not implemented",
      description: "Password change functionality is not implemented in this demo.",
    })
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">View and manage your profile information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your personal information and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold">{user.username}</h3>
                <p className="text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleChangePassword} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Account Status</p>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <p>Active</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Account Type</p>
              <p className="capitalize">{user.role} Account</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Last Login</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                toast({
                  title: "Feature not implemented",
                  description: "This feature is not implemented in this demo.",
                })
              }}
            >
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
