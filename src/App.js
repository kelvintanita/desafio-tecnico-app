import React, { Component } from 'react';
import { Button, Table, Row, Col, Card, message } from 'antd';
import DocumentosFormularioPage from './ui/DocumentosPage/DocumentosFormulariosPage';
import MessageError from './framework/components/MessageError';
import Api from './services/api/api';
import moment from 'moment'
import './App.css';

const apiCategorias = new Api('v1/categorias');
const apiDepartamentos = new Api('v1/departamentos');
const apiDocumentos = new Api('v1/documentos');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form: {},
      documentos: [],
      isLoaded: false,
      error: null,
      categorias: [],
      departamentos: [],
      status: 'Novo documento'
    }
  }

  async componentDidMount() {
    await this.buscarCategorias();
    await this.buscarDepartamentos();
    await this.buscarDocumentos();
  }

  buscarCategorias = async () => {
    this.setState({
      isLoading: true,
    });

    var categorias = await apiCategorias.get('');

    this.setState({
      categorias: categorias,
      isLoading: false,
    });
  }

  buscarDepartamentos = async () => {
    this.setState({
      isLoading: true,
    });

    var departamentos = await apiDepartamentos.get('');

    this.setState({
      isLoading: false,
      departamentos: departamentos
    });
  }

  buscarDocumentos = async () => {
    this.setState({
      isLoading: true,
    });

    var documentos = await apiDocumentos.get('');

    this.setState({
      isLoading: false,
      documentos: documentos
    });
  }

  onChange = (prop, value) => {
    let { form } = this.state;

    form = {
      ...form,
      [prop]: value
    };

    this.setState({ form });
  };

  onNovo = async () => {
    this.setState({
      form: {},
      status: 'Novo documento',
      error: null
    });
  }

  onDelete = async (row) => {
    await apiDocumentos.delete('', row.id, false);
    await this.buscarDocumentos();
  }

  onEdit = async (row) => {
    let { form } = this.state;

    form = {
      ...row
    };

    this.setState({
      form,
      status: 'Editando documento',
      error: null

    });
  }

  onSave = async () => {

    this.setState({ loading: true });

    try {

      let form = { ...this.state.form };

      await apiDocumentos.save('', form, false);
      await this.buscarDocumentos();
      message.success("Ebaa! Operação realizada com sucesso!");
      this.onNovo();

    } catch (e) {
      console.log(e);
      this.setState({ error: e });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {

    var {
      isLoaded,
      categorias,
      departamentos,
      documentos,
      form,
      status,
      error } = this.state;

    const columns = [
      {
        title: 'Código',
        dataIndex: 'codigo',
        key: 'codigo'
      },
      {
        title: 'Cadastro',
        dataIndex: 'dataCadastro',
        key: 'dataCadastro',
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        }
      },
      {
        title: 'Título',
        dataIndex: 'titulo',
        key: 'titulo'
      },
      {
        title: 'Categoria',
        dataIndex: 'categoria',
        key: 'categoria'
      },
      {
        title: 'Departamento',
        dataIndex: 'departamento',
        key: 'departamento'
      },
      , {
        title: '',
        dataIndex: 'acao',
        key: 'acao',
        width: 200,
        align: 'right',
        render: (record, row) => {
          return (
            <React.Fragment>
              <Button size="small" icon="edit" onClick={() => this.onEdit(row)} style={{ marginLeft: 8 }}>
                Editar
      			   </Button>
              <Button size="small" icon="delete" type="danger" onClick={() => this.onDelete(row)} style={{ marginLeft: 8 }}>
                Excluir
      			  </Button>
            </React.Fragment>
          );
        }
      }
    ];

    return (

      <div className="App">
        <header className="App-header">
          <h1>DESAFIO TÉCNICO</h1>

          <Row type="flex" gutter={16} justify="space-between" align="middle">
            <Col sm="12">
              <h4>{status}</h4>
            </Col>
            <Col sm="4">
              <Button
                type="primary"
                icon="plus"
                onClick={() => this.onNovo()}>Novo Documento</Button>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col sm="24">
              <MessageError error={error} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col sm={8}>
              <DocumentosFormularioPage
                categorias={categorias}
                departamentos={departamentos}
                model={form}
                onChange={this.onChange}
                onSave={(e) => this.onSave(e)}
                loading={isLoaded} />
              <Button
                type="primary"
                style={{ width: '100%' }}
                icon="save"
                onClick={() => this.onSave()}>Salvar</Button>
            </Col>
            <Col sm={16}>
              <Card >
                <Table
                  size="middle"
                  rowKey="id"
                  loading={isLoaded}
                  columns={columns}
                  dataSource={documentos} />
              </Card>
            </Col>
          </Row>
        </header>
      </div>
    );
  }
}

export default App;
