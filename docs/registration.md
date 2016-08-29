## Registration + Configuring Onboarding

Referrers should send users to register at `geneticconstructor.com/register`, and can send a configuration to dictate how new users are onboarded.

Onboarding includes:

- setting up initial projects
- specifying which extensions the user initially sees + can access

### Configuration

```
{
  projects: {
    <projectKey> : {
      default: true
    },
    ...
  },
  extensions: {
    <extensionKey> : {
      active: false
    },
    ...
  }
}
```

Can specify one default project, which is loaded when the user logs in

Extensions can be deactived / hidden by setting `active = false`

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

##### Local Development

In local development, the user is overridden and updated to the new configuration.

However, initial projects cannot be changed.

##### Deployed Development

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