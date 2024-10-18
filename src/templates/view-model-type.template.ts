export function getDefaultViewModelType(pascalCaseVieModelTypeName: string) {
    return `abstract class ${pascalCaseVieModelTypeName}ViewModelType {}
`;
}

