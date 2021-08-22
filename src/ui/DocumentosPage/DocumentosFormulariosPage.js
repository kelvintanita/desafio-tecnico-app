import React from 'react';
import { Row, Col, Form, Input, Button, Icon, Select } from 'antd';
import createForm from '../../framework/components/Form/createForm';
const FormItem = Form.Item;


class DocumentosFormulariosPage extends React.Component {

    render() {
        const { form, isLoading, categorias, departamentos } = this.props;
        const { getFieldDecorator } = form;

        return (
            <React.Fragment>
                    <Row type="flex" justify="start" align="bottom">
                        <Col className="form-group" sm={24}>
                            <FormItem >
                                {getFieldDecorator('codigo', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'codigo é obrigatório'
                                        }
                                    ]
                                })(<Input className="form-control" placeholder="Código ex: 01/2018" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="start" align="bottom">
                        <Col className="form-group" sm={24}>
                            <FormItem >
                                {getFieldDecorator('titulo', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'título é obrigatório'
                                        }
                                    ]
                                })(<Input className="form-control" placeholder="Título" />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="form-group" sm={24}>
                            <FormItem>
                                {getFieldDecorator('categoriaId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'categoria é obrigatório'
                                        }
                                    ]
                                })(
                                    <Select key="id" className="form-control" placeholder="Selecione a categoria">
                                        {categorias.map((item) => <Select.Option key={item.id} value={item.id}>{item.nome}</Select.Option>)}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-group" sm={24}>
                            <FormItem>
                                {getFieldDecorator('departamentoId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'departamento é obrigatório'
                                        }
                                    ]
                                })(
                                    <Select className="form-control" placeholder="Selecione o departamento">
                                        {departamentos.map((item) => <Select.Option value={item.id}>{item.nome}</Select.Option>)}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
            </React.Fragment >
        );
    }
}

export default createForm(DocumentosFormulariosPage);
