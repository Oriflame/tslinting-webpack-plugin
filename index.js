const { Linter, Configuration } = require("tslint");


class TSLintingWebpackPlugin {
	constructor (options) {
		// Default options
        this.options = Object.assign(
            {
               fix: false,
				formatter: "codeFrame" 
			},
			options
        );

		this.configurationFilename = "tslint.json";
		this.results = null;
	}


	/**
     * Connects the plugin instance into WebPack pipeline's events.
     */
    apply (compiler) {
		compiler.plugin("this-compilation", (compilation) => {
			const program = Linter.createProgram("./tsconfig.json");
			const linter = new Linter(this.options, program);

			const files = Linter.getFileNames(program);

			files.forEach(file => {
				const sourceFile = program.getSourceFile(file);
				const fullText = sourceFile.getFullText();
				const fileContents = sourceFile.getText();

				const configuration = Configuration.findConfiguration(this.configurationFilename, file).results;
				linter.lint(file, fullText, configuration);
			});

			const results = linter.getResult();

			if (results.errorCount) {
				compilation.errors.push("TSLint: \n\n" + results.output);
			}
		});
    }

}

module.exports = TSLintingWebpackPlugin;
