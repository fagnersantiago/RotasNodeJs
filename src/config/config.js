const env = process.env.Node_Env || "dev";

const config = () => {
  switch (env) {
    case "dev":
      return {
        stringDbConnection:
          "mongodb+srv://admin:<password>@cluster0.jvjxd.mongodb.net/<dbname>?retryWrites=true&w=majority",
      
          jwt_pass:'secret',
          jwt_expires_in:'7d'
      
        };

    case "prod":
      return {};
  }
};

console.log("ambiente de desenvolvimento", `${env.toLocaleLowerCase()}`);

module.exports = config();
