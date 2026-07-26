/**
 * Serves PDF files from the ./assets directory.
 * A request to the root path ("/") serves ROOT_FILE_NAME; any other path
 * (e.g. "/file-abc.pdf") serves the matching file from ./assets.
 * Requests for files that don't exist are redirected (301) to the root path.
 *
 */

const ROOT_FILE_NAME = "Resume_Tanmay_2026_07.pdf";

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (url.pathname === "/") {
			url.pathname = `/${ROOT_FILE_NAME}`;
		}

		const response = await env.ASSETS.fetch(new Request(url, request));

		if (response.status === 404) {
			return Response.redirect(new URL("/", url), 301);
		}

		return response;
	},
};
