# **TaraOnline**

> Microservices

## TaraOnline Logo Hosting in https://postimg.cc/HV6htNjb

## Developing

### Built With

- [Moleculer - Progressive microservices framework for Node.js](https://moleculer.services/)

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Nats Server](https://docs.nats.io/nats-server/installation)
- [Redis Server](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298)
- [MongoDB]()

### Setting up Dev

1. Clone an application from the repository
    ```shell
    $ git clone git@gitlab.com:t2985/taraonline_api.git
    $ cd taraonline_api/
    ```
2. Install dependencies
    ```shell
    $ npm install
    ```
3. Add `.env` file with environment variables. You can check `.env_example`
4. In the `.env` file need set connection to NATS server and DB
5. Run the project
    ````shell
    $ nats-server
    $ npm run dev
    ````

### Seed

https://github.com/palpinter/moleculer-apollo-demo

### MongoDB

If you want to create a collection, you should just call createCollection instead. insertOne is for you to insert a
document into a collection and updateOne is for you to update a particular document in a collection

### Google app key:

https://console.cloud.google.com/apis/dashboard?hl=uk&pli=1&authuser=1&project=tooktook-325211&supportedpurview=project


## cron time calculator

https://crontab.guru
