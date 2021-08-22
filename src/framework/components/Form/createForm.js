import React from 'react';
import { Form } from 'antd';

export default function createForm(Componente) {
	//Form.Create do antd, binda os FormItem com o input,
	//onFieldsChange, escuta qualquer mudança no campo, e manda para o formulario e ao mesmo tempo, para o HoC de Form,
	//o HoC de form salva os errors do field
	//
	//mapPropsToFields, permite a alteração dos values pelo compoennte pai e retorna os dados do field salvos pelo HoC
	const HoC = Form.create({
		onFieldsChange(props, changedFields) {
			for (let prop in changedFields) {
				props.onChange(prop, changedFields[prop].value);
				props.onFieldUpdated(changedFields[prop]);
			}
		},

		mapPropsToFields(props, more) {
			var form = {};

			for (let field in props.model) {
				const _field = props.fields[field] || {};

				form[field] = Form.createFormField({
					..._field,
					value: props.model[field]
				});
			}

			return form;
		}
	})((props) => (
		<Form
			className={'form-inline'}
			onSubmit={(e) => {
				e.preventDefault();
				props.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						props.onSave(values);
					}
				});
			}}
		>
			{/* redireciona o form padrão  */}
			<Componente {...props} />
		</Form>
	));

	//HoC para guardar o status dos fields
	return class extends React.Component {
		state = { fields: {} };
		handleOnFieldUpdated = (field) => {
			this.setState({
				fields: {
					...this.state.fields,
					[field.name]: field
				}
			});

			this.props.onFieldUpdated && this.props.onFieldUpdated(field);
		};

		render() {
			return <HoC {...this.props} fields={this.state.fields} onFieldUpdated={this.handleOnFieldUpdated} />;
		}
	};
}
