import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

      <div className="grid gap-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="User Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="user@example.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Configure your API keys and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <Input id="api-key" type="password" defaultValue="sk-••••••••••••••••••••••••" />
              <p className="text-xs text-muted-foreground">Your API key is encrypted and securely stored</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="advanced-features">Advanced Features</Label>
                <p className="text-xs text-muted-foreground">Enable advanced AI features for your chatbots</p>
              </div>
              <Switch id="advanced-features" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save API Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
