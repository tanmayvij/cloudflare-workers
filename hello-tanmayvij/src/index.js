import quotes from './quotes.json'

function randomQuote() {
	return quotes[Math.floor(Math.random() * quotes.length)];
}

// Colors the banner is allowed to randomly appear in.
const BANNER_COLORS = ["cyan", "green", "yellow", "magenta", "white"];

function randomBannerColor() {
	return BANNER_COLORS[Math.floor(Math.random() * BANNER_COLORS.length)];
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const ansi = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	dim: "\x1b[2m",

	cyan: "\x1b[96m",
	green: "\x1b[92m",
	yellow: "\x1b[93m",
	magenta: "\x1b[95m",
	white: "\x1b[97m",
};

function c(color, text) {
	return `${color}${text}${ansi.reset}`;
}

const banner = [
	"████████╗ █████╗ ███╗   ██╗███╗   ███╗ █████╗ ██╗   ██╗",
	"╚══██╔══╝██╔══██╗████╗  ██║████╗ ████║██╔══██╗╚██╗ ██╔╝",
	"   ██║   ███████║██╔██╗ ██║██╔████╔██║███████║ ╚████╔╝ ",
	"   ██║   ██╔══██║██║╚██╗██║██║╚██╔╝██║██╔══██║  ╚██╔╝  ",
	"   ██║   ██║  ██║██║ ╚████║██║ ╚═╝ ██║██║  ██║   ██║   ",
	"   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ",
];

function buildResponseLines(quote) {
	const lines = [""];

	const bannerColor = ansi[randomBannerColor()];
	banner.forEach((l) => lines.push(c(bannerColor, l)));

	lines.push("");

	lines.push(`${ansi.bold}${ansi.white}Hello, I'm Tanmay Vij.${ansi.reset}`);
	lines.push("");

	lines.push(c(ansi.white, "Lead Software Engineer"));
	lines.push("Distributed Systems • AI • Cloud • DevOps");

	lines.push("");

	lines.push(c(ansi.green, "What I do"));
	lines.push(c(ansi.dim, "────────────────────────────────────────────────────────"));

	lines.push("");
	lines.push(" • LLM Engineering");
	lines.push(" • Systems Architecture");
	lines.push(" • AWS Certified Solutions Architect");
	lines.push(" • Networking & Infrastructure");

	lines.push("");

	lines.push(c(ansi.green, "Find me"));
	lines.push(c(ansi.dim, "────────────────────────────────────────────────────────"));

	lines.push("");

	lines.push(`🌐 ${ansi.yellow}https://tanmayvij.com${ansi.reset}`);
	lines.push(`🐙 ${ansi.yellow}https://github.com/tanmayvij${ansi.reset}`);
	lines.push(`💼 ${ansi.yellow}https://linkedin.com/in/tanmayvij${ansi.reset}`);

	lines.push("");

	lines.push(c(ansi.green, "Write to me"));
	lines.push(c(ansi.dim, "────────────────────────────────────────────────────────"));

	lines.push("");
	lines.push(`✉️  ${ansi.yellow}hello@tanmayvij.com${ansi.reset}`);

	lines.push("");

	lines.push(c(ansi.green, "Machine-readable output"));
	lines.push(c(ansi.dim, "────────────────────────────────────────────────────────"));

	lines.push("");
	lines.push(`curl ${ansi.yellow}https://hello.tanmayvij.com/json${ansi.reset}`);

	lines.push("");
	lines.push(c(ansi.dim, "────────────────────────────────────────────────────────"));
	lines.push("");

	lines.push(c(ansi.magenta, `"${quote.text}"`));
	lines.push("");
	lines.push(c(ansi.magenta, `— ${quote.author}`));

	lines.push("");
	lines.push(c(ansi.bold, "Have a great day :)"));

	return lines;
}

function streamedTextResponse(lines) {
	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		async start(controller) {
			for (const line of lines) {
				controller.enqueue(encoder.encode(line + "\n"));
				await sleep(25);
			}
			controller.close();
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=300",
			"Server": "hello.tanmayvij",
			"X-Response-Mode": "stream",
		},
	});
}

function jsonResponse(quote) {
	const body = {
		name: "Tanmay Vij",
		title: "Software Engineer",
		tagline: "Distributed Systems • AI • Cloud • DevOps",
		specialties: [
			"LLM Engineering",
			"Systems Architecture",
			"AWS Certified Solutions Architect",
			"Networking & Infrastructure",
		],
		links: {
			website: "https://tanmayvij.com",
			github: "https://github.com/tanmayvij",
			linkedin: "https://linkedin.com/in/tanmayvij",
			email: "hello@tanmayvij.com",
		},
		quote,
	};

	return new Response(JSON.stringify(body, null, 2), {
		headers: { "Content-Type": "application/json; charset=utf-8" },
	});
}

export default {
	async fetch(request) {
		const { pathname } = new URL(request.url);
		const quote = randomQuote();

		if (pathname === "/") {
			return streamedTextResponse(buildResponseLines(quote));
		}

		if (pathname === "/json") {
			return jsonResponse(quote);
		}

		return new Response("Not found", { status: 404 });
	},
};