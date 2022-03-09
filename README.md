#Instruções para execução do *front-end* localmente

Clone o repositório e entre no diretório do projeto via terminal no VS Code;

Instale as dependencias com o comando `npm install`;

<!Adicione o pacote ng-components do *design system* com o comando `ng add @po-ui/ng-components` (selecione N para a opção de customização de Sidebar);>

<!Instale o pacote ng-templates do *design system* com o comando `npm i @po-ui/ng-templates`;>

Execute a aplicação com o comando `npm run ng serve` ou `npm start`.

#Instruções para execução/subida do *front-end* nos ambientes de DEV, UAT e PROD

A aplicação fica hospedada em um bucket S3 que é acessado por meio de uma distribuição Cloudfront.

Por esse motivo, certifique-se que os stacks de DEV, UAT e PROD foram criados e estão ativos por meio do AWS Management Console ou com o comando `aws cloudformation describe-stacks --stack-name <nome_do_stack> --profile <profile desejado>`;

Caso haja algum problema com o passo anterior, um stack novo pode ser criado para um ambiente utilizando o comando `aws cloudformation deploy --template-file <nome do template> --stack-name <nome_do_stack>`;

> IMPORTANTE: Antes de criar um stack novo certifique-se que o stack que voce quer criar não existe e que não existem resquícios de stacks deletados (Ex : S3 buckets não removidos);

Lista de nomes de stack e arquivo template para cada ambiente:_

|                  |                        DEV                     | UAT | PROD |
|------------------|------------------------------------------------|-----|------|
| Nome de stack    |              aws-angular-bpo-test              |  -  |  -   |
| Nome do template |                cloudfront.yaml                 |  -  |  -   |


Após a verificação da existencia do stack do ambiente a ser utilizado, siga os 4 primeiros passos da seção de execução local para configuração dos pacotes do projeto;

Faça modificações (caso seja o caso) e para que o stack de hospedagem seja atualizado faça o deploy com os comandos a seguir:

`ng build --<flag_de_ambiente>`;

`aws s3 sync dist/<nome_do_projeto> s3://<id_bucket_s3> --sse AES256 --profile <perfil desejado>`;

`aws cloudfront create-invalidation --distribution-id <id_distribuição> --paths / --profile <perfil desejado>`.

Lista de parametros para cada ambiente :

|                  |                        DEV                     | UAT | PROD |
|------------------|------------------------------------------------|-----|------|
| Flag de ambiente |                      dev                       | uat | prod |
| Id Bucket S3     | aws-angular-bpo-test-appbucket-25rxhhi6kt8n    |  -  |  -   |
| Id Distribuição  |                E2A9GVFY2LPBQY                  |  -  |  -   |


#Instruções padrão para projetos Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
