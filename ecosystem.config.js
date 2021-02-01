module.exports = {
    "apps": [
      {
        "exec_mode": "fork_mode",
        "script": "./honeypot/index.js",
        "name": "honeypot"
      },
      {
        "exec_mode": "fork_mode",
        "script": "./gameserver/gameserver.py",
        "name": "gameserver",
        "interpreter": "python3"
      }
    ]
  };