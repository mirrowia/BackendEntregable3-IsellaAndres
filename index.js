const express = require("express");
const fs = require("fs");
class Contenedor {
  constructor(fileName) {
    this.fileName = fileName;
  }

  async save(Object) {
    const content = await this.getAll();
    const id = content.length <= 0 ? 1 : content[content.length - 1].id + 1;
    content.push({ id: id, ...Object });
    try {
      await fs.promises.writeFile(
        this.fileName,
        JSON.stringify(content, null, 2)
      );
      return id;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const content = await this.getAll();
      const object = content.find((cont) => cont.id === id);
      return object ? object : null;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      const content = await fs.promises.readFile(this.fileName, "utf-8");
      return content ? JSON.parse(content) : [];
    } catch (error) {
      return [];
    }
  }

  async deleteById(id) {
    let content = await this.getAll();
    content = content.filter((obj) => obj.id !== id);
    await fs.promises.writeFile(
      this.fileName,
      JSON.stringify(content, null, 2)
    );
  }

  async deleteAll() {
    const content = [];
    await fs.promises.writeFile(
      this.fileName,
      JSON.stringify(content, null, 2)
    );
  }
}

const app = express();
const PORT = 8080;

const contenedor = new Contenedor("productos.txt");

app.get("/", (req, res) => {
  res.send(
    "Intenta ingresar a los siguientes endpoints: http://localhost:8080/productos o http://localhost:8080/productoRandom"
  );
});

app.get("/productos", (req, res) => {
  contenedor.getAll().then((result) => res.send(result));
});

app.get("/productorandom", (req, res) => {
  contenedor.getAll().then((result) => {
    contenedor
      .getById(Math.floor(Math.random() * (result.length - 1) + 1))
      .then((result) => res.send(result));
  });
});

const server = app.listen(PORT, () => {
  console.log(`Servidor http corriendo en el puerto: ${PORT}`);
});

server.on("error", (error) => console.log(`Error en el servidor ${error}`));
