// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
	LinterGetOffensesFunction,
	LinterOffense,
	LinterOffenseSeverity,
} from "vscode-linter-api";


export interface EXCALOffense {
	issues: {
		file: string;
		start_location: {
			line: number;
			col: number;
		};
		message: string;
		id: string;
		end_location: {
			line: number;
			col: number;
		};
		severity: string;
		type: string;
	}[];
}

const offenseSeverity: { [key: string]: LinterOffenseSeverity } = {
	"CONVENTION": LinterOffenseSeverity.warning,
	"INFO": LinterOffenseSeverity.information,
	"MINOR": LinterOffenseSeverity.warning,
	"MAJOR": LinterOffenseSeverity.warning,
	"CRITICAL": LinterOffenseSeverity.error,
	"BLOCKER": LinterOffenseSeverity.error
};

export const getOffenses: LinterGetOffensesFunction = ({ uri, stdout }) => {

	const payload: EXCALOffense = JSON.parse(stdout);

	return payload.issues.map((offense) => {

		const lineStart = offense.start_location.line - 1;
		const columnStart = offense.start_location.col - 1;


		const lineEnd = Math.max(lineStart, offense.end_location.line - 1);
		const columnEnd = Math.max(columnStart, offense.end_location.col - 1);

		const sev = offenseSeverity[offense.severity]


		return {
			uri,
			lineStart,
			columnStart,
			lineEnd,
			columnEnd,
			code: offense.id,
			message: offense.message,
			source: "EXCAL",
			correctable: false,
			severity: sev,
		};
	});
};