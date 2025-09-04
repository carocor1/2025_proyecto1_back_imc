Feature: Cálculo del Índice de Masa Corporal (IMC) 

Scenario: Verificar que el servicio está definido 
Given que el servicio de cálculo de IMC está inicializado 
Then el servicio debería estar disponible para su uso

Scenario Outline: Calcular el IMC y determinar la categoría 
Given un usuario con peso kg y altura m 
When se calcula el IMC 
Then el IMC debería ser <imc_esperado> 
And la categoría debería ser "<categoria_esperada>"

Ejemplos:
  | peso   | altura | imc_esperado | categoria_esperada |
  | 70     | 1.75   | 22.86        | Normal            |
  | 50     | 1.75   | 16.33        | Bajo peso         |
  | 80     | 1.75   | 26.12        | Sobrepeso         |
  | 100    | 1.75   | 32.65        | Obeso             |
  | 75     | 1.80   | 23.15        | Normal            |
  | 53.45  | 1.70   | 18.49        | Bajo peso         |
  | 72.23  | 1.70   | 24.99        | Normal            |

Pruebas Unitarias:

Scenario: Calcular IMC para peso normal 
Given un usuario con peso 70 kg y altura 1.75 m W
hen se calcula el IMC Then el IMC debería ser 22.86 
And la categoría debería ser "Normal"

Scenario: Calcular IMC para bajo peso 
Given un usuario con peso 50 kg y altura 1.75 m 
When se calcula el IMC Then el IMC debería ser 16.33 
And la categoría debería ser "Bajo peso"

Scenario: Calcular IMC para sobrepeso 
Given un usuario con peso 80 kg y altura 1.75 m 
When se calcula el IMC 
Then el IMC debería ser 26.12 
And la categoría debería ser "Sobrepeso"

Scenario: Calcular IMC para obesidad 
Given un usuario con peso 100 kg y altura 1.75 m 
When se calcula el IMC 
Then el IMC debería ser 32.65 And la categoría debería ser "Obeso"

Scenario: Redondear IMC a dos decimales 
Given un usuario con peso 75 kg y altura 1.80 m 
When se calcula el IMC 
Then el IMC debería ser 23.15 
And la categoría debería ser "Normal"

Scenario: Manejar valores límite para bajo peso 
Given un usuario con peso 53.45 kg y altura 1.70 m 
When se calcula el IMC 
Then el IMC debería ser 18.49 
And la categoría debería ser "Bajo peso"

Scenario: Manejar valores límite para peso normal 
Given un usuario con peso 72.23 kg y altura 1.70 m 
When se calcula el IMC 
Then el IMC debería ser 24.99 
And la categoría debería ser "Normal"

Scenario: Calcular IMC con altura mínima permitida
Given un usuario con altura 0.1 m y peso 1 kg
When se calcula el IMC
Then el IMC debería ser 100
And la categoría debería ser "Obeso"

Scenario: Calcular IMC con altura máxima permitida
Given un usuario con altura 3 m y peso 80 kg
When se calcula el IMC
Then el IMC debería ser 8.89
And la categoría debería ser "Bajo peso"

Scenario: Calcular IMC con peso mínimo permitido
Given un usuario con altura 1.75 m y peso 1 kg
When se calcula el IMC
Then el IMC debería ser 0.33
And la categoría debería ser "Bajo peso"

Scenario: Calcular IMC con peso máximo permitido
Given un usuario con altura 1.75 m y peso 500 kg
When se calcula el IMC
Then el IMC debería ser 163.27
And la categoría debería ser "Obeso"

Scenario: Calcular IMC en límite superior de peso normal
Given un usuario con altura 1.7 m y peso 72.23 kg
When se calcula el IMC
Then el IMC debería ser 24.99
And la categoría debería ser "Normal"

Scenario: Calcular IMC en límite inferior de sobrepeso
Given un usuario con altura 1.7 m y peso 86.67 kg
When se calcula el IMC
Then el IMC debería ser 29.99
And la categoría debería ser "Sobrepeso"

Scenario: Calcular IMC en límite superior de bajo peso
Given un usuario con altura 1.7 m y peso 53.51 kg
When se calcula el IMC
Then el IMC debería ser 18.52
And la categoría debería ser "Normal"

Scenario: Calcular IMC en límite inferior de sobrepeso
Given un usuario con altura 1.7 m y peso 72.29 kg
When se calcula el IMC
Then el IMC debería ser 25.01
And la categoría debería ser "Sobrepeso"

Scenario: Calcular IMC en límite inferior de obesidad
Given un usuario con altura 1.7 m y peso 86.73 kg
When se calcula el IMC
Then el IMC debería ser 30.01
And la categoría debería ser "Obeso"

Scenario: Calcular IMC con peso cero
Given un usuario con altura 1.75 m y peso 0 kg
When se calcula el IMC
Then el IMC debería ser 0
And la categoría debería ser "Bajo peso"

Scenario: Calcular IMC con decimales largos en peso
Given un usuario con altura 1.75 m y peso 65.123456789 kg
When se calcula el IMC
Then el IMC debería ser 21.26
And la categoría debería ser "Normal"