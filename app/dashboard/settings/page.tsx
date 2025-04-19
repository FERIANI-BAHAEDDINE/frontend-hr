"use client"

import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: "english",
  })

  const handleToggleChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelectChange = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => handleToggleChange("darkMode")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleSelectChange("language", value)}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => handleToggleChange("notifications")}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <p className="capitalize">{user?.role} Account</p>
              <p className="text-sm text-muted-foreground">
                Your account type determines what features you have access to
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
