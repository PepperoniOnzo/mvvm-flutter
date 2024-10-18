import * as _ from "lodash";

import {
    InputBoxOptions,
    OpenDialogOptions,
    Uri,
    window,
    workspace,
} from "vscode";
import { existsSync, lstatSync, writeFile } from "fs";
import { getDefaultViewModel, getDefaultViewModelType, getDefaultViewModelRouteType } from "../templates/index";

export const newViewModel = async (uri: Uri) => {
    const viewModelName = await promptForVieModelName();

    if (_.isNil(viewModelName) || viewModelName.trim() === "") {
        window.showErrorMessage("The ViewModel name must not be empty");
        return;
    }

    let targetDirectory;
    if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
        targetDirectory = await promptForTargetDirectory();
        if (_.isNil(targetDirectory)) {
            window.showErrorMessage("Please select a valid directory");
            return;
        }
    } else {
        targetDirectory = uri.fsPath;
    }

    const changeCase = await import("change-case");
    const pascalCaseVieModelName = changeCase.pascalCase(viewModelName);

    try {
        await generateBlocCode(viewModelName, targetDirectory);
        window.showInformationMessage(
            `Successfully Generated ${pascalCaseVieModelName} Bloc`
        );
    } catch (error) {
        window.showErrorMessage(
            `Error:
            ${error instanceof Error ? error.message : JSON.stringify(error)}`
        );
    }
}

function promptForVieModelName(): Thenable<string | undefined> {
    const inputOptions = {
        prompt: "Enter ViewModel name",
        placeHolder: "ViewModelName"
    };

    return window.showInputBox(inputOptions);
}

async function promptForTargetDirectory() {
    const options = {
        canSelectMany: false,
        openLabel: "Select a folder to create the bloc in",
        canSelectFolders: true,
    };

    return window.showOpenDialog(options).then((uri) => {
        if (_.isNil(uri) || _.isEmpty(uri)) {
            return undefined;
        }
        return uri[0].fsPath;
    });
}

async function generateBlocCode(
    viewModelName: string,
    targetDirectory: string,
) {
    await Promise.all([
        createViewModelTemplate(viewModelName, targetDirectory),
        createViewModelTypeTemplate(viewModelName, targetDirectory),
        createViewModelRouteTypeTemplate(viewModelName, targetDirectory),
    ]);
}

async function createViewModelTemplate(
    viewModelName: string,
    targetDirectory: string
) {
    const changeCase = await import("change-case");
    const snakeCaseViewModelName = changeCase.snakeCase(viewModelName);
    const pascalCaseVieModelName = changeCase.pascalCase(viewModelName);

    const targetPath = `${targetDirectory}/${snakeCaseViewModelName}_view_model.dart`;
    if (existsSync(targetPath)) {
        throw Error(`${snakeCaseViewModelName}_view_model.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(
            targetPath,
            getDefaultViewModel(snakeCaseViewModelName, pascalCaseVieModelName),
            'utf8',
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

async function createViewModelTypeTemplate(
    viewModelName: string,
    targetDirectory: string
) {
    const changeCase = await import("change-case");
    const snakeCaseViewModelName = changeCase.snakeCase(viewModelName);
    const pascalCaseVieModelName = changeCase.pascalCase(viewModelName);

    const targetPath = `${targetDirectory}/${snakeCaseViewModelName}_view_model_type.dart`;
    if (existsSync(targetPath)) {
        throw Error(`${snakeCaseViewModelName}_view_model_type.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(
            targetPath,
            getDefaultViewModelType(pascalCaseVieModelName),
            'utf8',
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

async function createViewModelRouteTypeTemplate(
    viewModelName: string,
    targetDirectory: string
) {
    const changeCase = await import("change-case");
    const snakeCaseViewModelName = changeCase.snakeCase(viewModelName);
    const pascalCaseVieModelName = changeCase.pascalCase(viewModelName);

    const targetPath = `${targetDirectory}/${snakeCaseViewModelName}_view_model_route_type.dart`;
    if (existsSync(targetPath)) {
        throw Error(`${snakeCaseViewModelName}_view_model_route_type.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(
            targetPath,
            getDefaultViewModelRouteType(pascalCaseVieModelName),
            'utf8',
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}
