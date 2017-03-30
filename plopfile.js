const componentTypes = ['stateless', 'stateful'];
const componentNamePattern = /(__COMPONENT_NAME__)/gi;

module.exports = function (plop) {
  const p = plop;

  p.setGenerator('c', {
    description: 'create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
        validate(value) {
          if ((/.+/).test(value)) return true;
          return 'name is required';
        },
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: componentTypes,
        default: 0,
      },
    ],
    actions(data) {
      return [
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/index.jsx',
          templateFile: `plop/c/${data.type}.jsx`,
        },
        {
          type: 'modify',
          path: 'src/components/{{pascalCase name}}/index.jsx',
          pattern: componentNamePattern,
          template: '{{pascalCase name}}',
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/index.styl',
          templateFile: 'plop/c/index.styl',
        },
        {
          type: 'modify',
          path: 'src/components/{{pascalCase name}}/index.styl',
          pattern: componentNamePattern,
          template: '{{pascalCase name}}',
        },
      ];
    },
  });
};
