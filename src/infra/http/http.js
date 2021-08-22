import { AuthService } from '../auth';

function factoryFetch(url, options) {
	return fetch(url, options).then((response) => {
		return response;
	});
}

function combineOptions(options, optionsDefault) {
	let hdr = { ...optionsDefault, ...{ mode: 'cors' }, ...options };
	return hdr;
}

function defaultHeaders(accessToken) {
	return {
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json'
	};
}

function treatBody(options, body) {
	if (typeof body === 'string') {
		options.body = body;
	} else if (body) {
		options.body = JSON.stringify(body);
	}
}

function treatOptions(body, options, method, accessToken, headers) {
	let defaultHdr = defaultHeaders(accessToken);
	defaultHdr = { ...defaultHdr, ...headers };
	let ops = combineOptions(options, {
		method: method,
		headers: defaultHdr
	});

	treatBody(ops, body);

	return ops;
}

function factoryHttp(url, body, method, accessToken, headers) {
	let ops = treatOptions(body, {}, method, accessToken, headers);
	return factoryFetch(url, ops);
}

function serialize(obj) {
	let p = [];

	if (obj) {
		Object.keys(obj).forEach((key) => {
			p.push(key + '=' + encodeURIComponent(obj[key]));
		});
	}

	return p.join('&');
}

class Http {
	get(url, headers, params = {}) {
		return AuthService.getAccessToken().then((accessToken) => {
			return factoryHttp(
				`${url}${!!Object.keys(params).length ? '?' + serialize(params) : ''}`,
				null,
				'GET',
				accessToken,
				headers
			);
		});
	}

	post(url, body, headers) {
		return AuthService.getAccessToken().then((accessToken) => {
			return factoryHttp(url, body, 'POST', accessToken, headers);
		});
	}

	postNoAuthenticated(url, body, headers) {
		return factoryFetch(url, {
			body,
			method: 'POST',
			headers
		});
	}

	put(url, body, headers) {
		return AuthService.getAccessToken().then((accessToken) => {
			return factoryHttp(url, body, 'PUT', accessToken, headers);
		});
	}

	delete(url, body, headers) {
		return AuthService.getAccessToken().then((accessToken) => {
			return factoryHttp(url, body, 'DELETE', accessToken, headers);
		});
	}

	patch(url, body, headers) {
		return AuthService.getAccessToken().then((accessToken) => {
			return factoryHttp(url, body, 'PATCH', accessToken, headers);
		});
	}
}


export default new Http();
