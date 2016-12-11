const componentTypes = ['stateless', 'stateful'];

module.exports = function (plop) {
  const p = plop;

  p.setGenerator('c', {
    description: 'create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
        validate: function (value) {
          if ((/.+/).test(value)) { return true; }
          return 'name is required';
        },
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: componentTypes,
        default: 0,
      }
    ],
    actions: function (data) {
      return [
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/index.js',
          templateFile: `plop/c/${data.type}.js`,
        },
        {
          type: 'modify',
          path: 'src/components/{{pascalCase name}}/index.js',
          pattern: /(__COMPONENT_NAME__)/gi,
          template: '{{pascalCase name}}'
        },
        {
          type: 'add',
          path: 'src/components/{{pascalCase name}}/index.styl',
          templateFile: 'plop/c/index.styl',
        },
        {
          type: 'modify',
          path: 'src/components/{{pascalCase name}}/index.styl',
          pattern: /(__COMPONENT_NAME__)/gi,
          template: '{{pascalCase name}}'
        },
      ];
    }
  });
};
