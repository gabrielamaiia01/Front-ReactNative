import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function StockApp() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [foto, setFoto] = useState(null);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const buscarProdutosAoCarregar = async () => {
      try {
        const response = await fetch("http://192.168.100.9:3000/produtos");
        const produtos = await response.json();
        const produtosFormatados = produtos.map((produto) => ({
          id: produto._id,
          nome: produto.nome,
          descricao: produto.descricao,
          quantidade: produto.quantidade,
          foto: produto.foto
        }));
        setProducts(produtosFormatados);
      } catch (err) {
        alert(err.message);
      }
    }
    buscarProdutosAoCarregar();
  }, []);

  // Adicionar ou Editar Produto
//   const handleSaveProduct = async() => {
//     if (nome && descricao && quantidade) {
//       const produto = {
//         nome,
//         descricao,
//         quantidade,
//         foto,
//       };
//     }

//     try {
//       const response = editId
//       ? await fetch(`http://192.168.100.9:300/produtos/${editId}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(produto),
//         })
//         : await fetch("http://192.168.100.9.300/produtos", {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(produto),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           if (editId) {
//             setProducts(
//               products.map((produto) => {
//                 produto.it === editId
//                 ? { ...item, nome, descricao, quantidade, foto }
//                 : item
//               })
//             )
//           }
//         }
//       }
//     } catch (err) {
      
//     }
//   }
  const handleSaveProduct = () => {
    if (nome && descricao && quantidade) {
      if (editId) {
        // Editar Produto
        setProducts(
          products.map((item) =>
            item.id === editId
              ? { ...item, nome, descricao, quantidade, foto }
              : item
          )
        );
        setEditId(null);
      } else {
        // Adicionar Novo Produto
        setProducts([
          ...products,
          {
            // id: Date.now().toString(),
            nome,
            descricao,
            quantidade,
            convertImageToBase64,
          },
        ]);
      }
      resetForm();
    }
  };

  // Excluir Produto
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  // Iniciar Edição
  const handleEditProduct = (product) => {
    setEditId(product.id);
    setNome(product.nome);
    setDescricao(product.descricao);
    setQuantidade(product.quantidade.toString());
    setFoto(product.foto);
  };

  // Carregar Imagem
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos da permissão para acessar suas fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  // Resetar Formulário
  const resetForm = () => {
    setNome("");
    setDescricao("");
    setQuantidade("");
    setFoto(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Estoque</Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        keyboardType="numeric"
        onChangeText={setQuantidade}
      />

      {/* Botão para Selecionar Imagem */}
      <Button title="Escolher Imagem" onPress={pickImage} />
      {foto && (
        <Image source={{ uri: foto }} style={styles.imagePreview} />
      )}

      {/* Botão de Salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
        <Text style={styles.saveButtonText}>
          {editId ? "Salvar Alterações" : "Adicionar Produto"}
        </Text>
      </TouchableOpacity>

      {/* Lista de Produtos */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productDetails}>
              {item.foto && (
                <Image
                  source={{ uri: item.foto }}
                  style={styles.productImage}
                />
              )}
              <Text style={styles.productName}>{item.nome}</Text>
              <Text style={styles.productDescription}>{item.descricao}</Text>
              <Text style={styles.productQuantity}>Qtd: {item.quantidade}</Text>
            </View>
            <View style={styles.actions}>
              {/* Botão Editar */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditProduct(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              {/* Botão Excluir */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteProduct(item.id)}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#040DBF",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    marginTop: 10
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  productItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 20,
  
  },
  productDescription: {
    color: "#555",
  },
  productQuantity: {
    color: "#777",
  },
  actions: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: "#FF4D4D",
    padding: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  imageButton:{
    backgroundColor: "#ffff"
  }
});
