# GamingBot

GamingBot is an interactive Discord bot designed to enhance your server's experience with a variety of gaming-related features. Ideal for communities who love gaming, this bot brings fun and engagement to your Discord server.

## Features

### Reaction Roles
- Users can acquire a specific role by reacting to a bot-sent embed in the designated channel.
- This feature enhances user interaction and makes role assignment more dynamic.

### Experience Points (XP) System
- Users earn XP points randomly by sending messages in a specified channel.
- The more active a user is, the more points they accumulate.

### Profile Command (`/profile`)
- Users can view their profile, including their total XP and roles, with the `/profile` command.
- This feature allows users to track their progress and status within the server.

### Player vs Player (PVP) Duels (`/pvp`)
- Users with a minimum of 250 XP can challenge others to PVP duels using the `/pvp` command.
- Winners of duels can gain additional roles and rewards.

### Random Kick Probability
- A fun, risky feature where users have a small chance of getting kicked from the server when they send a message.
- Moderators and owners are protected from this feature to maintain server control.

## Installation

To set up GamingBot on your server, follow these steps:

1. Clone the repository to your local machine or server.
2. Install the required dependencies using `npm install`.
3. Set up your `.env` file with your Discord bot token and other configuration details.
4. Start the bot using a process manager like PM2 (e.g., `pm2 start index.js --name "GamingBot"`).

## Usage

After installation, invite the bot to your Discord server and set up the necessary channels and roles. Use the `/profile` and `/pvp` commands to interact with the bot's features.

## Contributing

Contributions to GamingBot are welcome. Please feel free to fork the repository, make changes, and submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

Thanks to all contributors and users of GamingBot for making this project possible.
