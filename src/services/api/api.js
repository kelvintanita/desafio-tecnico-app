import { stringify } from 'querystring';
import { BASE_URL_API } from '../../infra/config';
import { message, notification } from "antd";

class Api {
	constructor(endpoint) {
		this.baseUrl = BASE_URL_API + (endpoint ? `/${endpoint}` : '');
	}

	async fetchResource(method = 'GET', endpoint = '/', params = {}, requireAuth = true) {
		let headers = new Headers({
			Accept: 'application/json',
			'Content-Type': 'application/json'
		});

		var uri = `${this.baseUrl}/${endpoint}`;

		let response;

		if (method === 'GET' || method === 'DELETE') {
			uri += '?' + stringify(params);
			response = await fetch(uri, { method, headers });
		} else if (method === 'POST' && endpoint === '/token') {
			headers['Content-Type'] = 'application/json';

			var formBody = [];
			for (let property in params) {
				var encodedKey = encodeURIComponent(property);
				var encodedValue = encodeURIComponent(params[property]);
				formBody.push(encodedKey + '=' + encodedValue);
			}
			formBody = formBody.join('&');
			response = await fetch(uri, {
				method,
				headers,
				body: formBody
			});
		} else {
			response = await fetch(uri, {
				method,
				headers,
				body: JSON.stringify(params)
			});
		}

		if (!response.ok) {

			let type = response.headers.get('Content-type');

			if (type && type.indexOf('json') != -1) {

				let jsonResponse = await response.json();

				if (jsonResponse) {

					if (jsonResponse.message) {
						notification.error({
							message: jsonResponse.message || "Houve um erro ao realizar esta operação! Entre em contato com o administrador do sistema."
						});
					}

					throw { ...jsonResponse }
				}

				return jsonResponse;

			} else {

				let textResponse = await response.text();

				console.log("textResponse", textResponse);


				if (response.status == 403) {

					return response;
				}

				if (response.status == 500) {

					notification.error({
						message: textResponse || "Houve um erro ao realizar esta operação! Entre em contato com o administrador do sistema."
					});

					return response;
				}

				throw new Error(`Api Error: ${response.status} ${response.statusText} - ${textResponse}`);
			}
		}

		try {
			return await response.json();
		} catch (e) {
			return { e };
		}
	}

	async get(resource, params = {}, requireAuth = true) {
		return this.fetchResource('GET', resource, params, requireAuth);
	}

	async getById(resource, id, requireAuth = true) {
		let endpoint = `${resource}/${id}`;
		return this.fetchResource('GET', endpoint, {}, requireAuth);
	}

	async save(resource, model, requireAuth = true) {
		if (model.id) {
			let id = model.id;
			// let endpoint = `${resource}/${id}`;
			let endpoint = (resource ? `${resource}/` : '') + `${id}`;
			return this.fetchResource('PUT', endpoint, model, requireAuth);
		} else {
			return this.fetchResource('POST', resource, model, requireAuth);
		}
	}
	async post(resource, model, requireAuth = true) {
		if (model.id) {
			let id = model.id;
			let endpoint = (resource ? `${resource}/` : '') + `${id}`;
			return this.fetchResource('PUT', endpoint, model, requireAuth);
		} else {
			return this.fetchResource('POST', resource, model, requireAuth);
		}
	}

	async delete(resource, id, requireAuth = true) {
		let endpoint = `${resource}/${id}`;
		return this.fetchResource('DELETE', endpoint, {}, requireAuth);
	}

	async upload(file, resource = '', params = {}) {

		var formData = new window.FormData;

		//for (let prop in file) {
		formData.append('file', file);
		//}

		let endpoint = `${resource}`;

		let uri = `${this.baseUrl}`;

		if (endpoint) {
			uri += `/${endpoint}`;
		}

		let headers = new Headers();

		return await fetch(uri, {
			method: 'POST',
			headers,
			body: formData,
		}).then((data) => {
			return data.json();
		});
	}
}


export default (Api);