Referrers should send users to register at `/register`, and can send a configuration

Internally, Constructor will ensure the proper format of that payload and delegate to its internal router to register the user + set user object, and onboard the new user.

### Configuration

```
{
  projects: {
    <projectKey> : {
      access: true,
      default: true
    },
    ...
  },
  extensions: {
    <extensionKey> : {
      access: true,
      visible: true
    },
    ...
  }
}
```

Can specify one default project, which is loaded when the user logs in

Extensions can be hidden by setting `visible = false`

### Routes

#### /register

Route for registering a new user

 - takes in their user preferences, allowing referrers to send a configuration for new user defaults
 - delegates to auth/register, to register the user
 - onboards the user according to their configuration

Expects payload in form:

```
{
  user: {
   uuid: <uuid>,
   email: <email>,
   firstName: <string>,
   firstName: <string>,
  },
  config: <object of user prefs for constructor>
}
```

And creates the user object, verifies the config and merges with defaults, assigns to the user object, and then deletegates to the auth router:

#### /auth/register

Platform Auth, which handles creating the user, then runs the onLogin() hook to handle onboarding a new user

Expects user object in form:

```
{
  user: {
    uuid: <uuid>,
    email: <email>,
    firstName: <string>,
    firstName: <string>,
    data: {
      constructor: true
      [userConfigKey] : <object of user prefs for constructor>
    }
  }
}
```