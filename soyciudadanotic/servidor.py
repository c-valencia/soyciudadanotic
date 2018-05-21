from flask import Flask
from flask import request
from flask import render_template
from flask import session
from flask import flash
#import forms
from model import Base
from model import Usuario
from model import Categoria
from model import *
from clases import *
from config1 import ConexionBD
from sqlalchemy import create_engine
from sqlalchemy import update
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text, union, join
from flask import url_for, redirect
from werkzeug.security  import generate_password_hash
import json

from datetime import *

app = Flask(__name__)
app.secret_key = 's0yc1udadan0t1c'

class conexion():
	session = None

	def __init__(self):
		engine = create_engine('postgresql://postgres:postgres@localhost:5432/soyciudadanotic')
		Session = sessionmaker(bind=engine)
		self.session =Session()

	def getConexion(self):
		return (self.session)

	def cerrarConexion(self):
		self.session.close()

"""
login():
responde a la ruta raiz de la aplicacion por medio del decorador:
@app.route("/", methods= ['GET', 'POST'])

envia a un usuario registrado a su respectiva secion de usuario;
en caso contrario muestra un mensaje con el error.
"""
@app.route("/", methods= ['GET', 'POST'])
def login():
	sesion = conexion()
	
	if 'ingresar' in request.form:
		login = request.form['usuario']
		contrasenia = request.form['contrasenia']

		usuario = sesion.getConexion().query(Usuario).filter(Usuario.login == login and Usuario.contrasenia == contrasenia).first()
		sesion.cerrarConexion()
		#print(usuario)
		if usuario != None:
			if usuario.tipo == "Estudiante" and usuario.verify_contrasenia(contrasenia):
				session['username'] = login
				session['tipo'] = usuario.tipo
				##puede cambiarlo por el nombre del usuario si lo obtine posteriormente
				success_message = 'Bienvenido {}, a Soy Ciudadano Tic'.format(session['username'])
				flash(success_message, 'success')
				return redirect('/principalEstudiante')
			if usuario.tipo == "Administrador" and usuario.verify_contrasenia(contrasenia):
				print("entre a administrador")
				session['username'] = login
				session['tipo'] = usuario.tipo
				print(session)
				success_message = 'Bienvenido {}, a Soy Ciudadano Tic'.format(session['username'])
				flash(success_message, 'success')
				# return redirect(url_for('adminIndex'))
				return redirect(url_for('adminIndex'))
		else:
			fail_message = 'El usuario buscado no esta registrado!'
			flash(fail_message, 'error')
			return render_template('login.html')
				
	sesion.cerrarConexion()		
	return render_template('login.html')

"""
logout()
genera la salidad de los usuarios de la aplicacion eliminando la variable 
de la session["usernanme"]
"""
@app.route("/logout")
def logout():
	if "username" in session:
		#session.pop('username')
		session.clear()
	return redirect(url_for('login'))

@app.route("/admin", methods= ['GET', 'POST'])
def adminIndex():
	if(session['tipo'] == 'Administrador'):
		return render_template('administrador/index.html')
	else:
		return redirect(url_for('logout'))

@app.route("/admin/buscarUsuario", methods= ['GET', 'POST'])
def buscarUsuario():
	if(session['tipo'] == 'Administrador'):
		sesion = conexion()
		
		usuarios = sesion.getConexion().query(Usuario).filter(Usuario.estado == True).all()
		#usuarios = sesion.getConexion().query(Usuario).all()
		#sesion.cerrarConexion()
		if request.method == 'POST':
			if 'guardar' in request.form:
				login = request.form['login'].replace(" ", "")
				usuario = sesion.getConexion().query(Usuario).filter(Usuario.login == login).first()
				usuario.tipo = request.form['tipo_usuario'].replace(" ", "")
				usuario.contrasenia = generate_password_hash(request.form['contrasenia1'])
				sesion.getConexion().add(usuario)
				sesion.getConexion().commit()
				sesion.cerrarConexion()
				return redirect(url_for('buscarUsuario'))

			if 'eliminar' in request.form:
				login = request.form['loginEliminar'].replace(" ", "")
				usuario = sesion.getConexion().query(Usuario).filter(Usuario.login == login).first()
				print("entre en eliminar")
				print(usuario)
				usuario.estado = False;
				sesion.getConexion().add(usuario)
				sesion.getConexion().commit()
				sesion.cerrarConexion()
				return redirect(url_for('buscarUsuario'))
				

		return render_template('administrador/buscarUsuario.html', users = usuarios)
	else:
		return redirect(url_for('logout'))

@app.route("/admin/crearUsuario", methods= ['GET', 'POST'])
def crearUsuario():
	if(session['tipo'] == 'Administrador'):
		sesion = conexion()
		if request.method == 'POST':
			if 'guardar' in request.form:
				usuario = sesion.getConexion().query(Usuario).filter(Usuario.login == request.form['login']).first()
				print(usuario)
				if usuario  is None:
					usuario = Usuario(login=request.form['login'], tipo=request.form['tipo_usuario'], contrasenia=request.form['contrasenia'])
					sesion.getConexion().add(usuario)
					sesion.getConexion().commit()
					sesion.cerrarConexion()
					success_message = 'Se ha registrado exitosamente al usuario'
					flash(success_message, 'success')
				else:
					fail_message = 'El usuario ya esta registrado'
					flash(fail_message, 'error')
						

		return render_template('administrador/crearUsuario.html')
	else:
		return redirect(url_for('logout'))

"""
crearEstudiante()
"""
@app.route("/admin/crearEstudiante", methods= ['GET', 'POST'])
def crearEstudiante():
	if(session['tipo'] == 'Administrador'):
		sesion = conexion()

		if request.method == 'POST':

			if 'guardar' in request.form:
				usuario = sesion.getConexion().query(Usuario).filter(Usuario.estado == True).filter(Usuario.login == request.form['numero_identificacion']).filter(Usuario.tipo=="Estudiante").first()
				estudiante_consulta = sesion.getConexion().query(Estudiante).filter(Estudiante.num_identificacion == request.form['numero_identificacion']).first()
				print(usuario)
				print
				print(request.form['fecha_nacimiento'])
				if usuario is not None and estudiante_consulta is None:

					estudiante = Estudiante(num_identificacion=request.form['numero_identificacion'],   
					 					 nombres=request.form['nombre'], 
					 					 apellidos=request.form['apellido'], 
					 					 fecha_nacimiento = request.form['fecha_nacimiento'],
					 					 telefono = request.form['telefono'],
					 					 direccion = request.form['direccion'],
					 					 comuna = int(request.form['comuna']),
					 					 barrio = request.form['barrio'],
					 					 email= request.form['correo'],
					 					 usuario_id= usuario.login)
					print(estudiante)
					sesion.getConexion().add(estudiante)
					sesion.getConexion().commit()
					sesion.cerrarConexion()
					success_message = 'Se ha registrado exitosamente el estudiante'
					flash(success_message, 'success')
				else:
					fail_message = 'El estudiante ya esta registrado o no tiene usuario creado'
					flash(fail_message, 'error')


				#return render_template('administrador/crearEstudiante.html')
		return render_template('administrador/crearEstudiante.html')
	else:
		return redirect(url_for('logout'))


@app.route("/admin/admin_estudiante", methods = ['GET', 'POST'])
def admin_estudiante():
	if(session['tipo'] == 'Administrador'):
		sesion = conexion()
		
		estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.estado == True).all()
		if request.method == 'POST':
			if 'guardar' in request.form:
				estudiante_consultado = sesion.getConexion().query(Estudiante).filter(Estudiante.num_identificacion == request.form['numero_identificacion']).first()
				
				estudiante_consultado.nombres=request.form['nombre'] 
				estudiante_consultado.apellidos=request.form['apellido'] 
				estudiante_consultado.fecha_nacimiento=request.form['fecha_nacimiento']
				estudiante_consultado.telefono = request.form['telefono']
				estudiante_consultado.direccion = request.form['direccion']
				estudiante_consultado.comuna = int(request.form['comuna'])
				estudiante_consultado.barrio = request.form['barrio']
				estudiante_consultado.email= request.form['correo']
				print(estudiante_consultado)
				sesion.getConexion().add(estudiante_consultado)
				sesion.getConexion().commit()
				sesion.cerrarConexion()
				return redirect(url_for('admin_estudiante'))
					
			if 'eliminar' in request.form:
				num_identificacion = request.form['identificacionEliminar']
				estudiante_eliminado = sesion.getConexion().query(Estudiante).filter(Estudiante.num_identificacion == num_identificacion).first()
				estudiante_eliminado.estado = False;
				sesion.getConexion().add(estudiante_eliminado)
				sesion.getConexion().commit()
				sesion.cerrarConexion()
				return redirect(url_for('admin_estudiante'))
		
		return render_template('administrador/adminEstudiante.html', users = estudiante)
	else:
		return redirect(url_for('logout'))

"""
crearInstructor()
"""
@app.route("/admin/crearInstructor", methods= ['GET', 'POST'])
def crearInstructor():
	if(session['tipo'] == 'Administrador'):
		sesion = conexion()

		if request.method == 'POST':
			usuario = sesion.getConexion().query(Usuario).filter(Usuario.estado == True).filter(Usuario.login == request.form['numero_identificacion']).filter(Usuario.tipo=="Instructor").first()
			instructor = sesion.getConexion().query(Instructor).filter(Instructor.num_identificacion == request.form['numero_identificacion']).first()	
			if 'guardar' in request.form:
				if usuario is not None and instructor is None:		
					instructor = Instructor(num_identificacion=request.form['numero_identificacion'],
										 nombres=request.form['nombre'], 
										 apellidos=request.form['apellido'], 
										 area=request.form['area'], 
										 email=request.form['correo'],
										 usuario_id=usuario.login)

					sesion.getConexion().add(instructor)
					sesion.getConexion().commit()
					sesion.cerrarConexion()
					success_message = 'Se ha registrado exitosamente al instructor'
					flash(success_message, 'success')
				else:
					fail_message = 'El instructor ya esta registrado o no tiene usuario creado'
					flash(fail_message, 'error')


		return render_template('administrador/crearInstructor.html')
	else:
		return redirect(url_for('logout'))


@app.route("/admin/admin_instructores", methods= ['GET', 'POST'])
def admin_instructores():
	if(session['tipo'] == 'Administrador'):
		sesion = conexion()
		instructores = sesion.getConexion().query(Instructor).filter(Instructor.estado == True).all()
		
		
		if request.method == 'POST':
			if 'guardar' in request.form:
				num_identificacion=request.form['numero_identificacion']
				instructor = sesion.getConexion().query(Instructor).filter(Instructor.num_identificacion == request.form['numero_identificacion']).first()
				print(instructor)
				instructor.nombres=request.form['nombre'] 
				instructor.apellidos=request.form['apellido'] 
				instructor.area=request.form['area'] 
				instructor.email=request.form['correo']
				sesion.getConexion().add(instructor)
				sesion.getConexion().commit()
				sesion.cerrarConexion()
				return redirect(url_for('admin_instructores'))
					
			if 'eliminar' in request.form:
				
				num_identificacion = request.form['identificacionEliminar']
				instructor_eliminado = sesion.getConexion().query(Instructor).filter(Instructor.num_identificacion == num_identificacion).first()
				instructor_eliminado.estado = False;
				sesion.getConexion().add(instructor_eliminado)
				sesion.getConexion().commit()
				sesion.cerrarConexion()
				return redirect(url_for('admin_instructores'))
		
		return render_template('administrador/adminInstructor.html', users = instructores)
	else:
		return redirect(url_for('logout'))

"""
crearCohorte()
"""
@app.route("/admin/crearCohorte", methods= ['GET', 'POST'])
def crearCohorte():

	return render_template('administrador/crearCohorte.html')

"""
crearCategoría()
"""
@app.route("/admin/crearCategoria", methods= ['GET', 'POST'])
def crearCategoria():
	sesion = conexion()
	if request.method == 'POST':
		if 'guardar' in request.form:
			categoria = Categoria(id_categoria=request.form['id_categoria'], nombre=request.form['nombre'], descripcion=request.form['descripcion'])
			print(categoria)
			sesion.getConexion().add(categoria)
			sesion.getConexion().commit()
			sesion.cerrarConexion()

	return render_template('administrador/crearCategoria.html')	

@app.route("/principal/estudiante", methods= ['GET', 'POST'])
def principalEstudiante():
	"""sesion = conexion()
	login = session['username']

	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	matricula = sesion.getConexion().query(Matricula).filter(Matricula.estudiante_id == estudiante.num_identificacion and Matricula.estado == True).first()
	cursos = sesion.getConexion().query(Curso).filter(Curso.categoria_id == matricula.categoria_id and Curso.estado == True).order_by(Curso.id_curso.asc()).all()
	print(cursos)"""
	return render_template('estudiante/inicioEstudiante1.html')

@app.route("/estudiante", methods= ['GET', 'POST'])
def estudiante():
	sesion = conexion()
	login = session['username']

	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	matricula = sesion.getConexion().query(Matricula).filter(Matricula.estudiante_id == estudiante.num_identificacion and Matricula.estado == True).first()
	cursos = sesion.getConexion().query(Curso).filter(Curso.categoria_id == matricula.categoria_id and Curso.estado == True).order_by(Curso.id_curso.asc()).all()
	print(cursos)
	return render_template('estudiante/panelEstudianteMapa.html', cursos = cursos)

@app.route("/estudiante/curso/<curso>", methods= ['GET', 'POST'])
def estudianteCurso(curso):
	sesion = conexion()
	login = session['username']

	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	#matricula = sesion.getConexion().query(Matricula).filter(Matricula.estudiante_id == estudiante.num_identificacion and Matricula.estado == True).first()
	ras = sesion.getConexion().query(Resultado_de_aprendizaje).filter(Resultado_de_aprendizaje.curso_id == curso and Resultado_de_aprendizaje.estado == True).order_by(Resultado_de_aprendizaje.id_ra.asc()).all()
	print(ras[0])
	return render_template('estudiante/panelEstudianteMapaRas.html', ras = ras)

@app.route("/estudiante/ra/<ra>", methods= ['GET', 'POST'])
def estudianteRa(ra):
	sesion = conexion()
	login = session['username']

	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	#matricula = sesion.getConexion().query(Matricula).filter(Matricula.estudiante_id == estudiante.num_identificacion and Matricula.estado == True).first()
	secuencia_actividades = sesion.getConexion().query(Secuencia_actividades).filter(Secuencia_actividades.ra_id == ra and Secuencia_actividades.estado == True).order_by(Secuencia_actividades.posicion.asc()).all()
	#print(str(secuencia_actividades))
	return render_template('estudiante/panelEstudianteMapaAct.html', secuencia_actividades = secuencia_actividades)

@app.route("/estudiante/actividad/<actividad>", methods= ['GET', 'POST'])
def estudianteActividad(actividad):
	if request.args.get('ref', None) == 'logout':
		return redirect( url_for('logout'))

	sesion = conexion()
	login = session['username']

	
	#matricula = sesion.getConexion().query(Matricula).filter(Matricula.estudiante_id == estudiante.num_identificacion and Matricula.estado == True).first()
	
	actividad_evaluativa = sesion.getConexion().query(Actividad_evaluativa).filter(Actividad_evaluativa.id_actividad_evaluativa == actividad).filter(Actividad_evaluativa.estado == True).first()
	ra = sesion.getConexion().query(Resultado_de_aprendizaje).filter(Resultado_de_aprendizaje.id_ra == actividad_evaluativa.ra_id).first()
	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	actividades_evaluativas_matricula = sesion.getConexion().query(Actividades_evaluativas_matricula).filter(Actividades_evaluativas_matricula.estudiante_id == estudiante.num_identificacion).filter(Actividades_evaluativas_matricula.actividad_id == actividad).first()
	video = sesion.getConexion().query(Material_de_ayuda).join(Material_de_ayuda_actividad, Material_de_ayuda_actividad.material_ap_id == Material_de_ayuda.id_material_de_ayuda).filter(Material_de_ayuda.tipo == "video").filter(Material_de_ayuda_actividad.actividad_id == actividad).first()
	guia = sesion.getConexion().query(Material_de_ayuda).join(Material_de_ayuda_actividad, Material_de_ayuda_actividad.material_ap_id == Material_de_ayuda.id_material_de_ayuda).filter(Material_de_ayuda.tipo == "guía").filter(Material_de_ayuda_actividad.actividad_id == actividad).first()
	"""print(actividad_evaluativa)
	print(ra)
	print(actividades_evaluativas_matricula)
	print(video)
	print(guia)"""
	print(request.form)
	if request.method == 'POST':
		if 'enviar' in request.form:
			
			actividades_evaluativas_matricula.puntos = int(request.form['puntos'])
			print(str(actividades_evaluativas_matricula))
			sesion.getConexion().add(actividades_evaluativas_matricula)
			sesion.getConexion().commit()
			sesion.cerrarConexion()
			return redirect('/principalEstudiante1/C01')

	return render_template('estudiante/panelEstudianteActividad.html', ruta=actividad_evaluativa.ruta, ra=ra, video=video, guia=guia, actividad_evaluativa=actividad_evaluativa)

@app.route("/estudiante/formativa/<actividad>", methods= ['GET', 'POST'])
def estudianteActividadFormativa(actividad):
	if request.args.get('ref', None) == 'logout':
		return redirect( url_for('logout'))

	sesion = conexion()
	login = session['username']

	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	actividad_formativa = sesion.getConexion().query(Actividad_formativa).filter(Actividad_formativa.id_actividad_formativa == actividad).first()
	ra = sesion.getConexion().query(Resultado_de_aprendizaje).filter(Resultado_de_aprendizaje.id_ra == actividad_formativa.ra_id).first()
	actividades_formativas_matricula = sesion.getConexion().query(Actividades_formativas_matricula).filter(Actividades_formativas_matricula.estudiante_id == estudiante.num_identificacion).filter(Actividades_formativas_matricula.actividad_id == actividad).first()
	if actividades_formativas_matricula.estado == False:
		actividades_formativas_matricula.estado = True
		sesion.getConexion().add(actividades_formativas_matricula)
		sesion.getConexion().commit()
		#sesion.cerrarConexion()

	sesion.cerrarConexion()	
	return render_template('estudiante/panelEstudianteActFormativa.html', actividad_formativa=actividad_formativa, ra=ra)	

@app.route("/admin/crearCurso", methods= ['GET', 'POST'])
def crearCurso():
	sesion = conexion()
	
	categorias = sesion.getConexion().query(Categoria).filter(Categoria.estado == True).all()
	cursos = sesion.getConexion().query(Curso).filter(Curso.estado == True).all()

	if request.method == 'POST':
		if 'guardar' in request.form:
			id_categoria = request.form['id_categoria'].split("-")
			id_curso = request.form['prerequisito'].split("-")
			curso = Curso(id_curso =request.form['id_curso'] , nombre = request.form['nombre'], descripcion = request.form['descripcion'], categoria_id = id_categoria[0], prerequisito = id_curso[0])
			print(curso)
			sesion.getConexion().add(curso)
			sesion.getConexion().commit()
			sesion.cerrarConexion()
			
	return render_template('administrador/crearCurso.html', categorias = categorias, cursos=cursos)

@app.route("/principalEstudiante", methods= ['GET', 'POST'])
def principalEstudiante1():
	if request.args.get('ref', None) == 'logout':
		return redirect( url_for('logout'))	

	if(session['tipo'] == 'Estudiante'):
		sesion = conexion()
		login = session['username']

		estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
		matricula = sesion.getConexion().query(Matricula).filter(Matricula.estudiante_id == estudiante.num_identificacion and Matricula.estado == True).first()
		cursos = sesion.getConexion().query(Curso).filter(Curso.categoria_id == matricula.categoria_id and Curso.estado == True).order_by(Curso.id_curso.asc()).all()
		sesion.cerrarConexion()	
		print(cursos[0])
		info_cursos = []
		for c in cursos:
			curs = [c.id_curso, c.nombre]
			info_cursos.append(curs) 
		return render_template('principalEstudiante.html', cursos = cursos, info_cursos=info_cursos)
	else:
		return redirect(url_for('logout'))

@app.route("/principalEstudiante1/<curso>", methods= ['GET', 'POST'])
def principalEstudianteCurso(curso):
	if request.args.get('ref', None) == 'logout':
		return redirect( url_for('logout'))

	sesion = conexion()
	login = session['username']

	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	curs = sesion.getConexion().query(Curso).filter(Curso.id_curso == curso).first()
	matricula = sesion.getConexion().query(Matricula).filter(Matricula.estudiante_id == estudiante.num_identificacion and Matricula.estado == True).first()
	ras = sesion.getConexion().query(Resultado_de_aprendizaje).filter(Resultado_de_aprendizaje.curso_id == curso and Resultado_de_aprendizaje.estado == True).order_by(Resultado_de_aprendizaje.id_ra.asc()).all()
	actividades = sesion.getConexion().query(Secuencia_actividades).filter(Secuencia_actividades.estado == True).order_by(Secuencia_actividades.ra_id.asc()).all()
	
	a = sesion.getConexion().query(Actividad_evaluativa.id_actividad_evaluativa, Actividad_evaluativa.descripcion, Actividad_evaluativa.ruta).join(Resultado_de_aprendizaje, Actividad_evaluativa.ra_id == Resultado_de_aprendizaje.id_ra).join(Curso, Curso.id_curso == Resultado_de_aprendizaje.curso_id).filter(Actividad_evaluativa.estado == True).all()
	b = sesion.getConexion().query(Actividad_formativa.id_actividad_formativa, Actividad_formativa.descripcion, Actividad_formativa.ruta).join(Resultado_de_aprendizaje, Actividad_formativa.ra_id == Resultado_de_aprendizaje.id_ra).join(Curso, Curso.id_curso == Resultado_de_aprendizaje.curso_id).filter(Actividad_formativa.estado == True).all()
	for i in a:
		b.append(i)

	if request.method == 'POST':
		if 'evaluacion' in request.form:	
			return redirect('/principalEstudiante1/evaluacion/'+curso)
		if 'mapa_actividades' in request.form:
		 	return redirect('/mapa_actividades/'+curso)

	sesion.cerrarConexion()				
			
	
	return render_template('principalEstudianteCurso.html', curso=curso, ras = ras, actividades = actividades, b=b, curs=curs)

@app.route("/principalEstudiante1/evaluacion/<curso>", methods= ['GET', 'POST'])
def principalEstudianteCursoEvaluacion(curso):
	if request.args.get('ref', None) == 'logout':
		return redirect( url_for('logout'))
	#Avance de los ra de un estaduiante
	sesion = conexion()
	login = session['username']

	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	ras = sesion.getConexion().query(Resultado_de_aprendizaje).filter(Resultado_de_aprendizaje.curso_id == curso and Resultado_de_aprendizaje.estado == True).order_by(Resultado_de_aprendizaje.id_ra.asc()).all()
	actividades = sesion.getConexion().query(Secuencia_actividades).filter(Secuencia_actividades.estado == True).order_by(Secuencia_actividades.ra_id.asc()).all()
	curs = sesion.getConexion().query(Curso).filter(Curso.id_curso == curso).first()
	avance_ras = [];
	nivel = 0
	for ra in ras:
		nivel=nivel + 1
		actividad_matricula = sesion.getConexion().query(Actividad_evaluativa.id_actividad_evaluativa, Actividad_evaluativa.descripcion,  Actividades_evaluativas_matricula.estado).join(Actividades_evaluativas_matricula, Actividades_evaluativas_matricula.actividad_id==Actividad_evaluativa.id_actividad_evaluativa).filter(Actividades_evaluativas_matricula.estudiante_id==estudiante.num_identificacion).filter(Actividad_evaluativa.ra_id==ra.id_ra).filter(Actividades_evaluativas_matricula.estado == False).all()
		if len(actividad_matricula) > 0:
			actividad_estado = Ra_estado(ra.id_ra, ra.descripcion, nivel, False)
			avance_ras.append(actividad_estado)
		else:
			actividad_estado = Ra_estado(ra.id_ra, ra.descripcion, nivel, True)
			avance_ras.append(actividad_estado)

	ros = sesion.getConexion().query(Resultado_observable.id_ro, Resultado_observable.descripcion,Actividad_evaluativa.ra_id, Actividad_evaluativa.id_actividad_evaluativa, Actividad_evaluativa.descripcion, Actividad_evaluativa.puntos_minimos, Actividad_evaluativa.puntos_maximos, Actividades_evaluativas_matricula.puntos, Actividades_evaluativas_matricula.estado).join(Actividad_evaluativa, Actividad_evaluativa.id_actividad_evaluativa==Resultado_observable.actividad_evaluativa_id).join(Actividades_evaluativas_matricula, Actividad_evaluativa.id_actividad_evaluativa == Actividades_evaluativas_matricula.actividad_id).filter(Actividades_evaluativas_matricula.estudiante_id == estudiante.num_identificacion).filter(Actividades_evaluativas_matricula.categoria_id == curs.categoria_id).all()	
	ros_string = []
	for ro in ros:
		ros_string.append([ro[0], ro[1], ro[2], ro[3], ro[4], str(ro[5]), str(ro[6]), str(ro[7]), str(ro[8])])
			
	return render_template('estudiante/panelEstudianteEvaluacion.html', avance_ras=avance_ras, ras = ras, curso=curso, ros=ros_string)		

@app.route("/index")
def index():
	return render_template('index.html')

@app.route("/prueba")
def prueba():
	return render_template('prueba.html')

@app.route("/prueba1")
def prueba1():
	return render_template('prueba1.html')

@app.route("/temp")
def temporal():
	return render_template('temporal.html')	

@app.route("/temp1")
def temporal1():
	return render_template('temporal1.html')

@app.route("/mapa_cursos/")
def mapa_cursos():
	sesion = conexion()
	login = session['username']
	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	matricula = sesion.getConexion().query(Matricula).filter(Matricula.estudiante_id == estudiante.num_identificacion and Matricula.estado == True).first()	
	cursos = sesion.getConexion().query(Curso).filter(Curso.categoria_id == matricula.categoria_id).all()
	print(cursos)
	return render_template('estudiante/mapa-cursos.html')

@app.route("/mapa_ras/<curso>")
def mapa_ras(curso):
	sesion = conexion()
	login = session['username']
	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	ras = sesion.getConexion().query(Resultado_de_aprendizaje).filter(Resultado_de_aprendizaje.curso_id == curso and Resultado_de_aprendizaje.estado == True).order_by(Resultado_de_aprendizaje.id_ra.asc()).all()
	avance_ras = [];
	nivel = 0
	for ra in ras:
		nivel=nivel + 1
		actividad_matricula = sesion.getConexion().query(Actividad_evaluativa.id_actividad_evaluativa, Actividad_evaluativa.descripcion,  Actividades_evaluativas_matricula.estado).join(Actividades_evaluativas_matricula, Actividades_evaluativas_matricula.actividad_id==Actividad_evaluativa.id_actividad_evaluativa).filter(Actividades_evaluativas_matricula.estudiante_id==estudiante.num_identificacion).filter(Actividad_evaluativa.ra_id==ra.id_ra).filter(Actividades_evaluativas_matricula.estado == False).all()
		if len(actividad_matricula) > 0:
			actividad_estado = [ra.id_ra, ra.descripcion, str(nivel), str(False)]
			avance_ras.append(actividad_estado)
		else:
			actividad_estado = [ra.id_ra, ra.descripcion, str(nivel), str(True)]
			avance_ras.append(actividad_estado)


	return render_template('estudiante/mapa-ras.html', ras=avance_ras)

@app.route("/mapa_actividades/<curso>")
def mapa_actividades(curso):
	sesion = conexion()
	login = session['username']

	estudiante = sesion.getConexion().query(Estudiante).filter(Estudiante.usuario_id == login).first()
	curs = sesion.getConexion().query(Curso).filter(Curso.id_curso == curso).first()
	ras = sesion.getConexion().query(Resultado_de_aprendizaje).filter(Resultado_de_aprendizaje.estado == True).order_by(Resultado_de_aprendizaje.id_ra.asc()).all()
	ras_string = []
	for ra in ras:
		resultado_aprendizaje = [ra.id_ra, ra.descripcion]
		ras_string.append(resultado_aprendizaje)

	actividades = sesion.getConexion().query(Secuencia_actividades).filter(Secuencia_actividades.estado == True).order_by(Secuencia_actividades.ra_id.asc()).all()
	#Avance de un estudiante por actividades				
	avance_actividades = []
	ac_evaluativas_estudiante = sesion.getConexion().query(Actividad_evaluativa.ra_id, Actividades_evaluativas_matricula.actividad_id, Actividad_evaluativa.descripcion, Actividad_evaluativa.tipo, Actividades_evaluativas_matricula.estado).join(Actividades_evaluativas_matricula, Actividad_evaluativa.id_actividad_evaluativa == Actividades_evaluativas_matricula.actividad_id).filter(Actividades_evaluativas_matricula.estudiante_id == estudiante.num_identificacion).filter(Actividades_evaluativas_matricula.categoria_id == curs.categoria_id).all()	
	ac_formativas_estudiante = sesion.getConexion().query(Actividad_formativa.ra_id, Actividades_formativas_matricula.actividad_id, Actividad_formativa.descripcion, Actividad_formativa.tipo, Actividades_formativas_matricula.estado).join(Actividades_formativas_matricula, Actividad_formativa.id_actividad_formativa == Actividades_formativas_matricula.actividad_id).filter(Actividades_formativas_matricula.estudiante_id == estudiante.num_identificacion).filter(Actividades_formativas_matricula.categoria_id == curs.categoria_id).all()
	
	#for para unir las actividades formativas y evaluativas con su respectivo estado que le pertenecen al estudiante
	for d in ac_formativas_estudiante:
		ac_evaluativas_estudiante.append(d)

	#for para construir la lista de actividades de un estudiante con su realizacion
	for sec in actividades: 
		for act in ac_evaluativas_estudiante:
			if sec.actividad == act[1]:
				actividad_estado = [act[0], act[1], sec.posicion, act[2], act[3], str(act[4])]
				#Actividad_estado(act[0], act[1], sec.posicion, act[2], act[3])
				avance_actividades.append(actividad_estado)		
	#sesion.cerrarConexion()		
	return render_template('estudiante/mapa-actividades.html', avance_actividades=avance_actividades, ras=ras_string, curso=curso)

if __name__ == '__main__':
	#app.run(host='192.168.0.3', port = 9800, debug =True)
	app.run(host='127.0.0.1', port = 9800, debug =True)
	"""with app.app_context():
		engine = create_engine('postgresql://postgres:postgres@localhost:5432/soyciudadanotic')
		Base.metadata.create_all(engine)
	app.run(host='192.168.0.8', port = 8500, debug =False)"""
