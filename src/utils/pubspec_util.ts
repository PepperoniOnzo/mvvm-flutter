import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export function getFlutterProjectName(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder is open.');
        return;
    }

    // Assuming the pubspec.yaml is in the root of the workspace
    const pubspecPath = path.join(workspaceFolders[0].uri.fsPath, 'pubspec.yaml');

    // Check if the file exists
    if (!fs.existsSync(pubspecPath)) {
        vscode.window.showErrorMessage('pubspec.yaml not found in the workspace.');
        return;
    }

    try {
        // Read and parse the pubspec.yaml file
        const fileContent = fs.readFileSync(pubspecPath, 'utf8');
        const pubspec = yaml.load(fileContent) as { name?: string };

        // Return the project name if it exists
        if (pubspec && pubspec.name) {
            return pubspec.name;
        } else {
            vscode.window.showErrorMessage('No "name" field found in pubspec.yaml.');
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error reading pubspec.yaml: ${error}`);
    }

    return;
}
