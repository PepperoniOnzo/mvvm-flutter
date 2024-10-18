export function getDefaultViewModel(snakeCaseViewModelName: string, pascalCaseVieModelName: string) {
    return `import '${snakeCaseViewModelName}_view_model_type.dart';
import '${snakeCaseViewModelName}_view_model_route_type.dart';

final class ${pascalCaseVieModelName}ViewModel extends ${pascalCaseVieModelName}ViewModelType
    implements ${pascalCaseVieModelName}ViewModelRouteType {
  ${pascalCaseVieModelName}ViewModel();
}
`;
}
