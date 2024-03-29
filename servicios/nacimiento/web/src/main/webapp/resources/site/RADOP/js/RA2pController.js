
App.controller('RA2pControllador',function($scope, $http, $rootScope, $uibModal, $timeout, validaciones) {
					var vm = this;
					$scope.validaciones = validaciones;
					vm.paso = 0;
					// Guarda en un array las vistas presentadas durante el
					// proceso
					vm.vistas = [];
					// arreglo de datos que han sido presentados en pantalla
					vm.modelos = [];
					// representa los datos actualmente presentes en pantalla
					vm.modelo = {};
					vm.titulos = [];
					vm.activo = -1;
					// /Variables a usar
					vm.padres = false;
					vm.EnviarOficio = false;
					vm.hijos = [];
					// vm.modelo.hijos = [1];
					vm.hijo = 1;
					hijo = {};
					vm.errorTecla = {};
					$scope.datosHijos = true;
					$scope.disabled = false;
					$scope.disabled2 = false;
					$scope.diasabled = false;
					$scope.di = false;

					// validaciones de patrones
					$scope.vPatron = {
						AlfaNumerico : /^[A-Za-z0-9]*$/,
						Alfa : /^[a-zA-Z]*$/,
						FormatoNombres: /^((([a-zA-Z ñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ]))|([-'])\1?(?!\4))+$/,
						FormatoCementerio: /^((([a-zA-Z0-9 ñÑáéíóúÁÉÍÓÚäëïöüÄËÏÖÜ]))|([-'])\1?(?!\4))+$/,
						AlfaText : 'Este campo solo permite letras, di&eacute;resis, ap&oacute;strofes, guiones y acentos',
						Pcementerio : 'Este campo solo permite letras, di&eacute;resis, ap&oacute;strofes, guiones, acentos y n&uacute;meros',
						Fnumero : 'Este campo admite solo n&uacute;meros',
						Facta : 'Este campo admite solo n&uacute;meros y tiene un minimo y maximo de 20 caracteres',
						Ffolio : 'Este campo admite solo n&uacute;meros y tiene un minimo y maximo de 5 caracteres',
						Ftomo : 'Este campo admite solo n&uacute;meros y tiene un minimo y maximo de 2 caracteres',
						TipoCed : /^[V|v|E|e]/,
						Numerico : /^[0-9]/,
						cedulaMaxLength : "9",
						cedulaMinLength : "6",
						nombreMaxlength : "50",
						nombreMinlength : "2",
						CedulaText : "Este campo permite solo n&uacute;meros, con un m&iacute;nimo de 6 caracteres y un m&aacute;ximo de 9 caracteres <br/> Ejemplo: 12345678",
						NumeroDocumento : /^[0-9]{6,11}$/,
						excepciones : [ 'Backspace', 'Tab', ' ', 'ArrowLeft',
								'ArrowRight', 'Delete', 'Caps Lock', 'Shift',
								'Control' ],
						capTuraEvento : function(event, patron) {

						}

					};

					// /Para colocar el titulo al wizard
					$scope.tituloWizard = "Registrar adopción";
					// estado del proceso
					// vm.estado = 'iniciarTramiteEDPIC';
					/**
					 * identifica el titulo de la etapa del proceso y el indice
					 * activo para resaltarlo con el color azul
					 */

					vm.presentarTitulo = function(mTitulo) {
						vm.activo = vm.titulos.indexOf(mTitulo);
						if (vm.activo == -1) {
							vm.titulos.push(mTitulo);
							vm.activo = vm.titulos.length - 1;
						}
					}
					vm.onKeyDown = function(event, validacion, id) {
						var excepciones = validaciones[validacion].excepciones;
						for (var i = 0; i < excepciones.length; i++) {
							if (event.key === excepciones[i])
								return;
						}
						var patron = new RegExp(validaciones[validacion].expReg);
						if (!patron.test(event.key)) {
							event.preventDefault();
							vm.errorTecla[id] = true;
							return;
						}
						vm.errorTecla[id] = false;
					}

					vm.onBlur = function() {
						vm.errorTecla[id] = false;
					}
					/**
					 * Maneja como se muestran las vistas.
					 */
					vm.presentarVista = function($scope, vm, response) {
						vm.vista = response.data.vista;
						vm.modelo = response.data.modelo;
						// vm.estado = 'mostrarTipoPermiso';
						vm.presentarTitulo(response.data.modelo.titulo);
					}

					/**
					 * llamadaAjax
					 */
					llamadaAjax = function($http, $scope, vm, url, datos,
							accionSatisfactoria, metodo) {
						$http({
							method : metodo,
							url : url,
							data : JSON.stringify(datos)
						}).then(function successCallback(response) {
							vm.vista = response.data.vista;
							vm.modelo = response.data.modelo;
							llamarDisabled();
							vm.presentarTitulo(response.data.modelo.titulo);
							console.log(vm.modelo);
						}, function errorCallback(response) {
							console.log("error: " + response.data);
						});
					}
					
					llamadaAjax2 = function($http, $scope, vm, url, datos, accionSatisfactoria, metodo){
						datos.ruta = 'http://localhost:8080' + url;
					 $http({
					  method: metodo,
					  url: '/web-generales/direccionesControlador',
					  data: angular.toJson(datos)//JSON.stringify(datos)
					 }).then(function successCallback(response) {
					  accionSatisfactoria($scope, vm, response);
					  llamarDisabled();
					  vm.presentarTitulo(response.data.modelo.titulo);
					 }, function errorCallback(response) {
					  console.log("error: "+response.data);
					 });
					}
					
					llamadaAjaxRadop = function($http, $scope, vm, url, datos,
							accionSatisfactoria, metodo) {
						$http({
							method : metodo,
							url : url,
							data : JSON.stringify(datos)
						}).then(function successCallback(response) {
							accionSatisfactoria($scope, vm, response);
							console.log(vm.modelo);
						}, function errorCallback(response) {
							console.log("error: " + response.data);
						});
					}

					/**
					 * Carga los datos iniciales del proceso
					 */
					vm.rutas = [ {
						ruta : '/web-nacimiento/iniciarTramiteRADOP',
						funcion : vm.presentarVista,
						metodo : 'POST'
					}, {
						ruta : '/web-nacimiento/RADOP_adoptado_hijo',
						funcion : vm.presentarVista,
						metodo : 'POST'
					}, {
						ruta : '/web-nacimiento/RADOP_adoptado',
						funcion : vm.presentarVista,
						metodo : 'POST'
					}, {
						ruta : '/web-nacimiento/RADOP_acta_prim',
						funcion : vm.presentarVista,
						metodo : 'POST'
					}, {
						ruta : '/web-nacimiento/RADOP_buscarActa',
						funcion : vm.presentarVista,
						metodo : 'POST'
					}, 
					];

					// Datos a ser enviados al momento de cargar el modal
					vm.modelo = {
						id : $rootScope.objectSelected.numeroSolicitud,
						paso : 0,
						estatu : $rootScope.objectSelected.codigoEstadoSolicitud
					};
					llamadaAjax($http, $scope, vm, vm.rutas[vm.paso].ruta,
							vm.modelo, vm.rutas[vm.paso].funcion,
							vm.rutas[vm.paso].metodo);

					console.log("*****RUTA ARREGLO **** " + vm.rutas[0].ruta);
					console.log("*****RUTA STATU **** " + vm.modelo.id);

					vm.siguiente = function() {
						// guarda en la pila la vista actual
						if (vm.paso == 4) {
//							$rootScope.cancelar1();
						}
						vm.vistas.push(vm.vista);
						vm.modelos.push(vm.modelo);
						vm.paso++;
						console.log("num de paso" + vm.paso);
						if (vm.paso > 5) {
							console.log("aqui va a cerrar");
							$rootScope.cancelar1();
							// return;
						}

						if (vm.paso == 4) {
							$scope.consultaActa();
							 $timeout(function(){
								 vm.abrirModalActa();
							 },3000);
							
							
							
//							vm.abrirModalActa();
						}
//						 if (vm.paso == 6) {
//						 vm.actualizarEstado();
//						 return;
//						 }
						llamadaAjax($http, $scope, vm, vm.rutas[vm.paso].ruta,
								vm.modelo, vm.rutas[vm.paso].funcion,
								vm.rutas[vm.paso].metodo);
					}

					vm.actualizarEstado = function() {
						console.log("cambio de estarus");
						llamadaAjaxRadop($http, $scope, vm,
								'/web-nacimiento/actualizarEstado', vm.modelo,
								vm.notificacion, "POST");

					}
					vm.retorno = function() {
						console.log("retorno!!!");

					}

					vm.regresar = function() {
						vm.vista = vm.vistas[vm.vistas.length - 1];
						vm.modelo = vm.modelos[vm.modelos.length - 1];
						vm.modelos.splice(vm.modelos.length - 1, 1);
						vm.vistas.splice(vm.vistas.length - 1, 1);
						console.log("paso antes de restar: " + vm.paso);
						vm.paso--;
						if (vm.activo < vm.titulos.length) {
							vm.titulos.splice(vm.activo + 1, vm.titulos.length
									- vm.activo - 1);
						}
						vm.activo = vm.titulos.indexOf(vm.modelo.titulo);
						console.log("paso despues de restar: " + vm.paso);
					}

					vm.confirmarSalidaModulo = function() {
						presentarModal($scope, $uibModal, vm.salirModulo,
								'¿Desea cancelar la solicitud?',
								$rootScope.tituloWizard, 's');
					}
					vm.salirModulo = function() {
						$rootScope.cancelar1();
					}

					vm.cancel = function() {
						vm.confirmarSalidaModulo();
					}

					vm.cancelar = function() {
						vm.confirmarSalidaModulo();
					}

					// ---------funciones internas ------------ //
					$scope.mostrarCampos = function() {
						$scope.campos = true;
					}

					$scope.ocultarCampos = function() {
						$scope.campos = false;
					}

					// /////////////////Modales//////////////////////
//					vm.abrirModalActa = function() {
//						console.log("estoy en el modal");
//						presentarModal2(
//								$scope,
//								$uibModal,
//								vm.otraModalActa(), 
//								vm.volverActa(),
//								'El(La) adoptado(a) no posee un acta de nacimiento registrada. Se procederá a enviar una notificación al (a la) Registrador(a) Civil ',
//								$rootScope.tituloWizard, 'c');
//					}
					
					vm.abrirModalActa =function(){	
						var modalInstance = $uibModal.open({
							templateUrl: '/web-generales/pages/templates/imprimir/modalConfirmacion.html',
							controller: function($scope,$uibModalInstance){
								$scope.tipo = 'c';
								 $scope.mensaje='El(La) adoptado(a) no posee un acta de nacimiento registrada. Se procederá a enviar una notificación al (a la) Registrador(a) Civil ';
								$scope.titulo = $scope.tituloWizard;;
							
								 $scope.cancel = function () {
								        $uibModalInstance.dismiss('cancel');
								        vm.volverActa();
								    };
								    $scope.ok = function () {
								    	    $uibModalInstance.close(true);
								    	    llamadaAjax2($http, $scope, vm,
													'/web-nacimiento/guardarActaPrim', vm.modelo, vm.f, "POST");
								    	    vm.otraModalActa();
								    	   
								    };
								    $scope.cancelar = function () {
							    	    $uibModalInstance.close(true);
							    	    vm.volverActa();
								    }
							}
						});
						modalInstance.result.then(function () {
					
						}, function () {
							console.log("************VENGO DE CANCELAR");
							
						});
						
					}
					
					vm.f = function() {
						console.log("pase por el guardar acta prim");
					}
					
					vm.otraModalActa = function() {
						console.log("estoy en el otro modal");
						presentarModal(
								$scope,
								$uibModal,
								vm.notificacion,
								'Notificación enviada al (a la) Registrador(a) Civil  indicando que el acta primigenia se encuentra "Restringida"',
								$rootScope.tituloWizard, 'c');
					}
					vm.notificacion = function() {
						console.log("Todo bien si llegamos aca");
						llamadaAjaxRadop($http, $scope, vm,
								'/web-nacimiento/RADOP_recaudos', vm.modelo,
								vm.presentarVista, "POST");
						 vm.actualizarEstado();
						// $rootScope.cancelar1();
					}
					
					
					vm.volverActa = function() {
						console.log("Volvemos a la vista del acta prim");
						vm.paso--;
						///vm.mostrarImprimir=false;
						vm.regresar();
//						llamadaAjaxRadop($http, $scope, vm,
//								'/web-nacimiento/RADOP_acta_prim', vm.modelo,
//								vm.presentarVista, "POST");
//						vm.paso--;
						/// vm.actualizarEstado();
						// $rootScope.cancelar1();
					}
					// /////////////////////////////////////////////
					// Combo de Ocupaciones
					$scope.buscarOcupacion = function() {
						$http({
							method : 'GET',
							url : '/web-nacimiento/consultarOcupacion'
						}).then(function successCallback(ocupacion) {
							// /console.log(ocupacion.data);
							$scope.ocupaciones = ocupacion.data;
						}, function errorCallback(error) {
							console.log("error: " + error.data);
						});
					}
					$scope.buscarOcupacion();

					// /Nacionalidad condicionada por el tipo de Doc
					$scope.buscarNacionalidad = function() {
						$http({
							method : 'GET',
							url : '/web-nacimiento/cosultarNacionalidad'
						}).then(function successCallback(nacionalidad) {
							// console.log(nacionalidad.data);
							$scope.nacionalidades = nacionalidad.data;
						}, function errorCallback(error) {
							console.log("error: " + error.data);
						});
					}

					$scope.buscarNacionalidad();

					// Combo de Ocupaciones
					$scope.buscarOficina = function() {
						$http({
							method : 'GET',
							url : '/web-nacimiento/consultarOficinasTodos'
						}).then(function successCallback(oficina) {
							// /console.log(ocupacion.data);
							$scope.oficinas = oficina.data;
						}, function errorCallback(error) {
							console.log("error: " + error.data);
						});
					}
					$scope.buscarOficina();

					// Buscar Comunidades Indigenas
					$scope.buscarComunidades = function() {
						$http(
								{
									method : 'GET',
									url : '/web-nacimiento/consultarComunidadIndigenaTodos'
								}).then(function successCallback(comunidad) {
							// /console.log(ocupacion.data);
							$scope.comunidades = comunidad.data;
						}, function errorCallback(error) {
							console.log("error: " + error.data);
						});
					}
					$scope.buscarComunidades();

					$scope.onKeyDownAlfa = function(event, validacion, id) {
						var excepciones = $scope.vPatron.excepciones;
						for (var i = 0; i < excepciones.length; i++) {
							if (event.key === excepciones[i])
								return;
						}
						var patron = $scope.vPatron.FormatoNombres;
						if (!patron.test(event.key)) {
							event.preventDefault();
							$scope.errorTecla[id] = true;
							return;
						}
						$scope.errorTecla[id] = false;
					}

					$scope.onKeyDownCementerio = function(event, validacion, id) {
						var excepciones = $scope.vPatron.excepciones;
						for (var i = 0; i < excepciones.length; i++) {
							if (event.key === excepciones[i])
								return;
						}
						var patron = $scope.vPatron.FormatoCementerio;
						if (!patron.test(event.key)) {
							event.preventDefault();
							$scope.errorTecla[id] = true;
							return;
						}
						$scope.errorTecla[id] = false;
					}

					$scope.onKeyDownNumerico = function(event, validacion, id) {
						var excepciones = $scope.vPatron.excepciones;
						for (var i = 0; i < excepciones.length; i++) {
							if (event.key === excepciones[i])
								return;
						}
						var patron = $scope.vPatron.Numerico;
						if (!patron.test(event.key)) {
							event.preventDefault();
							$scope.errorTecla[id] = true;
							return;
						}
						$scope.errorTecla[id] = false;
					}

					$scope.onBlur = function() {
						$scope.errorTecla[id] = false;
					}

					llamarDisabled = function() {
						// ///////////MAM
						if (vm.modelo['MAM'] != null) {
							if (vm.modelo['MAM'].primerNombre != null) {
								$scope.diasabled = true;
								// console.log(vm.modelo['MAM'].primerNombre);
							} else {
								$scope.diasabled = false;
							}
							if (vm.modelo['MAM'].segundoNombre != null) {
								$scope.diasabled = true;
								// console.log(vm.modelo['MAM'].segundoNombre);
							} else {
								$scope.diasabled = false;
							}
							if (vm.modelo['MAM'].primerApellido != null) {
								$scope.diasabled = true;
							} else {
								$scope.diasabled = false;
							}
							if (vm.modelo['MAM'].segundoApellido != null) {
								$scope.diasabled = true;
							} else {
								$scope.diasabled = false;
							}
							if (vm.modelo['MAM'].documentoIdentidad[0].numero != null) {
								// console.log(vm.modelo['MAM'].documentoIdentidad[0].numero);
								$scope.diasabled = true;
							} else {
								$scope.diasabled = false;
							}
							if (vm.modelo['MAM'].documentoIdentidad[0].tipoDocumento.nombre != null) {
								// console.log(vm.modelo['MAM'].documentoIdentidad[0].tipoDocumento.nombre);
								$scope.diasabled = true;
							} else {
								$scope.diasabled = false;
							}
						}
						// ///////////ADO
						if (vm.modelo['ADO'] != null) {
							if (vm.modelo['ADO'].primerNombre != null) {
								$scope.disabled = true;
								// console.log(vm.modelo['ADO'].primerNombre);
							} else {
								$scope.disabled = false;
							}
							if (vm.modelo['ADO'].segundoNombre != null) {
								$scope.disabled = true;
								// console.log(vm.modelo['ADO'].segundoNombre);
							} else {
								$scope.disabled = false;
							}
							if (vm.modelo['ADO'].primerApellido != null) {
								$scope.disabled = true;
							} else {
								$scope.disabled = false;
							}
							if (vm.modelo['ADO'].segundoApellido != null) {
								$scope.disabled = true;
							} else {
								$scope.disabled = false;
							}
							if (vm.modelo['ADO'].documentoIdentidad[0].numero != null) {
								// console.log(vm.modelo['ADO'].documentoIdentidad[0].numero);
								$scope.disabled = true;
							} else {
								$scope.disabled = false;
							}
							if (vm.modelo['ADO'].documentoIdentidad[0].tipoDocumento.nombre != null) {
								// console.log(vm.modelo['ADO'].documentoIdentidad[0].tipoDocumento.nombre);
								$scope.disabled = true;
							} else {
								$scope.disabled = false;
							}
						}

						// //PAP
						if (vm.modelo['PAP'] != null) {
							if (vm.modelo['PAP'].primerNombre != null) {
								$scope.disabled2 = true;
								// console.log(vm.modelo['PAP'].primerNombre);
							} else {
								$scope.disabled2 = false;
							}
							if (vm.modelo['PAP'].segundoNombre != null) {
								$scope.disabled2 = true;
								// console.log(vm.modelo['PAP'].segundoNombre);
							} else {
								$scope.disabled2 = false;
							}
							if (vm.modelo['PAP'].primerApellido != null) {
								$scope.disabled2 = true;
							} else {
								$scope.disabled2 = false;
							}
							if (vm.modelo['PAP'].segundoApellido != null) {
								$scope.disabled2 = true;
							} else {
								$scope.disabled2 = false;
							}
							if (vm.modelo['PAP'].documentoIdentidad[0].numero != null) {
								// console.log(vm.modelo['PAP'].documentoIdentidad[0].numero);
								$scope.disabled2 = true;
							} else {
								$scope.disabled2 = false;
							}
							if (vm.modelo['PAP'].documentoIdentidad[0].tipoDocumento.nombre != null) {
								// console.log(vm.modelo['PAP'].documentoIdentidad[0].tipoDocumento.nombre);
								$scope.disabled2 = true;
							} else {
								$scope.disabled2 = false;
							}
						}

					}

					// ng-change... para
					vm.MostrarDatosPadres = function() {
						vm.padres = true;
						vm.EnviarOficio = true;
					}
					vm.OcultarDatosPadres = function() {
						vm.padres = false;
						vm.EnviarOficio = true;
					}

					// Agregar formilarios hijos
					$scope.control = 0;
					$scope.h;
					vm.addHijo = function() {
						$scope.isRequired = false;
						var hijo = {
							"acta_hijo" : null,
							"tomo_hijo" : null,
							"folio_hijo" : null,
							"oficina_hijo" : null,
							"fecha_hijo" : null,
							"primerNombre_hijo" : null,
							"segundoNombre_hijo" : null,
							"primerApellido_hijo" : null,
							"segundoApellido_hijo" : null,
							"documentoIdentidad[0].tipoDocumento.nombre" : null,
							"documentoIdentidad[0].numero" : null
						};

						vm.hijos.push(hijo);
						$scope.control++;
						hijo.ndHijos = $scope.control;
						$scope.h = $scope.control;
			
						$scope.cleanHIJO = function() {
							hijo.documentoIdentidad[0].numero = null;
						}

					}
					vm.restHijo = function() {
						if ($scope.control > 0) {
							vm.hijos.splice(vm.hijos.length - 1, 1);
							$scope.control--;
							if($scope.control == 0){
								$scope.isRequired = true;
							}
						}
					}
					
					

					vm.clearFields = function() {
						hijo.ndHijos = null;
						hijo.tomo1 = null;
						hijo.oficina1 = null;
						hijo.documentoIdentidad[0].tipoDocumento.nombre = null;
						hijo.documentoIdentidad[0].numero = null;
						hijo.primerNombre_hijo = null;
						hijo.segundoNombre_hijo = null;
						hijo.primerApellido_hijo = null;
						hijo.segundoApellido_hijo = null;
						hijo.acta_hijo = null;
						hijo.folio_hijo = null;
					}

					vm.form_cantidad_no = function() {
						$scope.cantidad_hijos = false;
						for(j=1; j<=$scope.control; j++){
							vm.hijos.splice(vm.hijos.length - 1, 1);
						}
						$scope.control =0;
					}
					vm.form_cantidad_si = function() {
						$scope.isRequired = true;
						$scope.cantidad_hijos = true;

					}

					vm.clearFieldsUeh = function() {
						vm.modelo.n_actaUeh = null;
						vm.modelo.n_folio = null;
						vm.modelo.tomo = null;
						vm.modelo.oficina = null;
						vm.modelo.fecha = null;
						vm.modelo['CONY'].documentoIdentidad[0].tipoDocumento.nombre = null;
						vm.modelo['CONY'].documentoIdentidad[0].numero = null;
						vm.modelo.nombre = null;
						vm.modelo.nombre2 = null;
						vm.modelo.apellido = null;
						vm.modelo.apellido2 = null;
					}

					
					vm.cleanCONY = function() {
						vm.modelo['CONY'].documentoIdentidad[0].numero = null;
					}
					
					vm.cleanMBIO = function() {
						vm.modelo['MamBio'].documentoIdentidad[0].numero = null;
					}
					vm.cleanPBIO = function() {
						vm.modelo['PapBio'].documentoIdentidad[0].numero = null;
					}
					
					
					$scope.consultaActa = function() {
						n_acta = vm.modelo.n_acta_adop;
						$http(
								{
									method : 'GET',
									url : '/web-nacimiento/existeActa/'
											+ vm.modelo.n_acta_adop
								}).then(function successCallback(n_acta) {
							console.log("n_acta " + n_acta);
							$scope.numAct = n_acta.data;
							if ($scope.numAct[null] == "false") {
								vm.abrirModalActa();
							}
						}, function errorCallback(error) {
							console.log("error: " + error.data);
						});
					}

					console.log(vm.modelo['ADO']);
					$scope.numeroControl = 0;
					$scope.setCedula = function() {
						if (vm.modelo['ADO'] != null
								&& $scope.numeroControl < 1) {
							$scope.tipoDocumento = vm.modelo['ADO'].documentoIdentidad[0].tipoDocumento.codigo;
							if ($scope.tipoDocumento == 'CED') {
								$scope.cedula = vm.modelo['ADO'].documentoIdentidad[0].numero;
								$scope.respuesta = [];
								$scope.respuesta = $scope.cedula.split("-");
								$scope.num = parseInt($scope.respuesta[1]
										.toString());
								$scope.numeroControl++;

							} else {
								$scope.num = vm.modelo['ADO'].documentoIdentidad[0].numero;
								$scope.numeroControl++;
							}
						}
						vm.modelo['ADO'].documentoIdentidad[0].numero = $scope.num;
						return $scope.num;
					}

				});
