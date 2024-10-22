import * as vscode from 'vscode';
import { newViewModel } from './commands/index'

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "mvvm-flutter" is now active!');

	const disposable = vscode.commands.registerCommand('mvvm-flutter.new-view-model', newViewModel);

	context.subscriptions.push(disposable);
}

export function deactivate() { }
