from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from werkzeug.security  import generate_password_hash
from werkzeug.security  import check_password_hash
from sqlalchemy import create_engine
from sqlalchemy import null

Base = declarative_base()

class Usuario(Base):
	__tablename__ = 'usuario'

	login = Column(String(30), primary_key=True)
	tipo = Column(String(30))
	contrasenia = Column(String(256))
	estado = Column(Boolean, default=True)
	#estudiante = relationship("Estudiante")
	

	def __init__(self, login, tipo, contrasenia):
		
		self.login = login
		self.tipo = tipo
		self.contrasenia = self.__create_contrasenia(contrasenia)

	def __repr__(self):
		return "<Usuario (login = ' % s ', tipo = ' % s ', contrasenia = ' % s ')>" % (
			self.login, self.tipo, self.__create_contrasenia(self.contrasenia))

	def __create_contrasenia(self, contrasenia):
		return generate_password_hash(contrasenia)

	def verify_contrasenia(self, contrasenia):
		return check_password_hash(self.contrasenia, contrasenia)

class Estudiante(Base):
	__tablename__ = 'estudiante'

	num_identificacion = Column(String(30), primary_key=True)
	nombres = Column(String(50))
	apellidos  = Column(String(50))
	fecha_nacimiento = Column(Date)
	telefono = Column(String(20))
	direccion = Column(String(50))
	comuna = Column(Integer)
	barrio = Column(String(100))
	email = Column(String(50))
	estado = Column(Boolean, default=True)
	usuario_id =  Column(String(30), ForeignKey('usuario.login', onupdate="CASCADE", ondelete="CASCADE"))
	
	def __init__(self, num_identificacion, nombres, apellidos, fecha_nacimiento, telefono, direccion, comuna, barrio, email, usuario_id):

		self.num_identificacion = num_identificacion
		self.nombres = nombres
		self.apellidos = apellidos
		self.fecha_nacimiento = fecha_nacimiento 
		self.telefono = telefono
		self.direccion = direccion
		self.comuna = comuna
		self.barrio = barrio
		self.email = email
		self.usuario_id = usuario_id


	def __repr__(self):
		return "<Estudiante (num_identificacion = ' % s ', nombres = ' % s ', apellidos = ' % s ', fecha_nacimiento = ' % s ', telefono =  ' % s ', direccion = ' % s ', comuna = ' % s ', barrio = ' % s ', email =  ' % s ', usuario_id =  ' % s ')>" % (
			self.num_identificacion, self.nombres, self.apellidos, self.fecha_nacimiento, self.telefono, self.direccion, self.comuna, self.barrio, self.email, self.usuario_id)

class Instructor(Base):
	__tablename__ = 'instructor'

	num_identificacion = Column(String(30), primary_key=True)
	nombres = Column(String(50))
	apellidos  = Column(String(50))
	area = Column(String(50))
	email = Column(String(50))
	estado = Column(Boolean, default=True)
	usuario_id =  Column(String(30), ForeignKey('usuario.login', onupdate="CASCADE", ondelete="CASCADE"))

	def __init__(self, num_identificacion, nombres, apellidos, area, email, usuario_id):

		self.num_identificacion = num_identificacion
		self.nombres = nombres
		self.apellidos = apellidos
		self.area = area 
		self.email = email
		self.usuario_id = usuario_id


	def __repr__(self):
		return "<Instructor (num_identificacion = ' % s ', nombres = ' % s ', apellidos = ' % s ', area = ' % s ', email =  ' % s ', usuario_id =  ' % s ')>" % (
			self.num_identificacion, self.nombres, self.apellidos, self.area, self.email, self.usuario_id)

class Cohorte(Base):
	__tablename__ = 'cohorte'

	id_cohorte = Column(String(10), primary_key=True)
	fecha_inicio = Column(Date)
	fecha_fin = Column(Date)
	estado = Column(Boolean, default=True)

class Categoria(Base):
	__tablename__ = 'categoria'

	id_categoria = Column(String(10), primary_key=True)
	nombre = Column(String(50))	
	descripcion = Column(Text)
	estado = Column(Boolean, default=True)

	def __init__(self, id_categoria, nombre, descripcion):

		self.id_categoria = id_categoria
		self.nombre = nombre
		self.descripcion = descripcion

	def __repr__(self):
		return "<Categoria (id_categoria = ' % s ', nombre = ' % s ', descripcion = ' % s ')>" % (
			self.id_categoria, self.nombre, self.descripcion)

class Curso(Base):
	__tablename__ = 'curso'

	id_curso = Column(String(10), primary_key=True)
	nombre = Column(String(50))	
	descripcion = Column(Text)
	categoria_id =  Column(String(10), ForeignKey('categoria.id_categoria', onupdate="CASCADE", ondelete="CASCADE"))
	prerequisito =  Column(String(10), ForeignKey('curso.id_curso', onupdate="CASCADE", ondelete="CASCADE"), default=null())
	estado = Column(Boolean, default=True)

	def __init__(self, id_curso, nombre, descripcion, categoria_id, prerequisito):

		self.id_curso = id_curso
		self.nombre = nombre
		self.descripcion = descripcion
		self.categoria_id = categoria_id 
		self.prerequisito = prerequisito 

	def __repr__(self):
		return "<Curso (id_curso = ' % s ', nombre = ' % s ', descripcion = ' % s ', categoria_id = ' % s ', prerequisito =  ' % s ')>" % (
			self.id_curso, self.nombre, self.descripcion, self.categoria_id, self.prerequisito)

class Resultado_de_aprendizaje(Base):
	__tablename__ = 'resultado_de_aprendizaje'

	id_ra = Column(String(10), primary_key=True)
	descripcion = Column(Text)	
	curso_id = Column(String(10), ForeignKey('curso.id_curso', onupdate="CASCADE", ondelete="CASCADE"))
	estado = Column(Boolean, default=True)

	def __init__(self, id_ra, descripcion, curso_id):

		self.id_ra = id_ra
		self.descripcion = descripcion
		self.curso_id = curso_id 
		
	def __repr__(self):
		return "<Resultado_de_aprendizaje (id_ra = ' % s ', descripcion = ' % s ', curso_id = ' % s ')>" % (
			self.id_ra, self.descripcion, self.curso_id)

class Secuencia_actividades(Base):
	__tablename__ = 'secuencia_actividades'

	ra_id = Column(String(10), ForeignKey('resultado_de_aprendizaje.id_ra', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	posicion = Column(Integer, primary_key=True)	
	actividad = Column(String(10))
	tipo = Column(String(20))
	estado = Column(Boolean, default=True)

	def __init__(self, ra_id, posicion, actividad, tipo):

		self.ra_id = ra_id
		self.posicion = posicion
		self.actividad = actividad
		self.tipo = tipo

		
	def __repr__(self):
		return "<Secuencia_actividades (ra_id = ' % s ', posicion = ' % s ', actividad = ' % s ', tipo = ' % s ')>" % (
			self.ra_id, self.posicion, self.actividad, self.tipo)
	
class Actividad_formativa(Base):
	__tablename__ = 'actividad_formativa'

	id_actividad_formativa = Column(String(10), primary_key=True)
	descripcion = Column(Text)
	tipo = Column(String(30))
	ruta = Column(String(256))
	ra_id = Column(String(10),  ForeignKey('resultado_de_aprendizaje.id_ra', onupdate="CASCADE", ondelete="CASCADE"))
	estado = Column(Boolean, default=True)

	def __init__(self, id_actividad_formativa, descripcion, tipo, ruta, ra_id):

		self.id_actividad_formativa = id_actividad_formativa
		self.descripcion = descripcion
		self.tipo = tipo
		self.ruta = ruta
		self.ra_id = ra_id
		
	def __repr__(self):
		return "<Actividad_formativa (id_actividad_formativa = ' % s ', descripcion = ' % s ', tipo = ' % s ', ruta = ' % s ', ra_id = ' % s ')>" % (
			self.id_actividad_formativa, self.descripcion, self.tipo, self.ruta, self.ra_id)

class Actividad_evaluativa(Base):
	__tablename__ = 'actividad_evaluativa'

	id_actividad_evaluativa = Column(String(10), primary_key=True)
	descripcion = Column(Text)
	tipo = Column(String(30))
	puntos_minimos = Column(Integer)
	puntos_maximos = Column(Integer)	
	ruta = Column(String(256))
	ra_id = Column(String(10),  ForeignKey('resultado_de_aprendizaje.id_ra', onupdate="CASCADE", ondelete="CASCADE"))
	material_ap_id = Column(String(10), ForeignKey('material_de_ayuda.id_material_de_ayuda', onupdate="CASCADE", ondelete="CASCADE"))
	estado = Column(Boolean, default=True)

	def __init__(self, id_actividad_evaluativa, descripcion, tipo, puntos_minimos, puntos_maximos, ruta, ra_id, material_ap_id):

		self.id_actividad_evaluativa = id_actividad_evaluativa
		self.descripcion = descripcion
		self.tipo = tipo
		self.puntos_minimos = puntos_minimos
		self.puntos_maximos = puntos_maximos
		self.ruta = ruta
		self.ra_id = ra_id
		self.material_ap_id = material_ap_id
		
		
	def __repr__(self):
		return "<Actividad_evaluativa (id_actividad_evaluativa = ' % s ', descripcion = ' % s ', tipo = ' % s ', puntos_minimos = ' % s ', puntos_maximos = ' % s ', ruta = ' % s ', ra_id = ' % s ', material_ap_id = ' % s ')>" % (
			self.id_actividad_evaluativa, self.descripcion, self.tipo, self.puntos_minimos, self.puntos_maximos, self.ruta, self.ra_id, self.material_ap_id)

class Resultado_observable(Base):
	__tablename__ = 'resultado_observable'

	id_ro = Column(String(10), primary_key=True)
	descripcion = Column(Text)
	actividad_evaluativa_id =  Column(String(10), ForeignKey('actividad_evaluativa.id_actividad_evaluativa', onupdate="CASCADE", ondelete="CASCADE"))
	estado = Column(Boolean, default=True)

	def __init__(self, id_ro, descripcion, actividad_evaluativa_id, estado):

		self.id_ro = id_ro
		self.descripcion = descripcion
		self.actividad_evaluativa_id = actividad_evaluativa_id
		self.estado = estado
		
	def __repr__(self):
		return "<Resultado_observable (id_ro = ' % s ', descripcion = ' % s ', actividad_evaluativa_id = ' % s ', estado = ' % s ')>" % (
			self.id_ro, self.descripcion, self.actividad_evaluativa_id, self.estado)

class Material_de_ayuda(Base):
	__tablename__ = 'material_de_ayuda'

	id_material_de_ayuda = Column(String(10), primary_key=True)
	descripcion = Column(Text)
	tipo = Column(String(50))
	ruta = Column(String(256))
	estado = Column(Boolean, default=True)

	def __init__(self, id_material_de_ayuda, descripcion, tipo, ruta, estado):

		self.id_material_de_ayuda = id_material_de_ayuda
		self.descripcion = descripcion
		self.tipo = tipo
		self.ruta = ruta
		self.estado = estado
		
	def __repr__(self):
		return "<Actividades_formativas_matricula (id_material_de_ayuda = ' % s ', descripcion = ' % s ', tipo = ' % s ', ruta = ' % s ', estado = ' % s ')>" % (
			self.id_material_de_ayuda, self.descripcion, self.tipo, self.ruta, self.estado)		

class Categorias_cohorte(Base):
	__tablename__ = 'categorias_cohorte'

	cohorte_id = Column(String(10), ForeignKey('cohorte.id_cohorte', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	categoria_id =  Column(String(10), ForeignKey('categoria.id_categoria', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	instructor = Column(String(30), ForeignKey('instructor.num_identificacion', onupdate="CASCADE", ondelete="CASCADE"))
	

class Matricula(Base):
	__tablename__ = 'matricula'

	cohorte_id = Column(String(10), ForeignKey('cohorte.id_cohorte', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	categoria_id =  Column(String(10), ForeignKey('categoria.id_categoria', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	estudiante_id = Column(String(10), ForeignKey('estudiante.num_identificacion', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	medalleria = Column(Integer)
	estado = Column(Boolean, default=True)

class Actividades_evaluativas_matricula(Base):
	__tablename__ = 'actividades_evaluativas_matricula'

	cohorte_id = Column(String(10), ForeignKey('cohorte.id_cohorte', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	categoria_id =  Column(String(10), ForeignKey('categoria.id_categoria', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	estudiante_id = Column(String(10), ForeignKey('estudiante.num_identificacion', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	actividad_id =  Column(String(10), ForeignKey('actividad_evaluativa.id_actividad_evaluativa', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	puntos = Column(Integer)
	estado = Column(Boolean, default=False)

	def __init__(self, cohorte_id, categoria_id, estudiante_id, actividad_id, puntos, estado):

		self.cohorte_id = cohorte_id
		self.categoria_id = categoria_id
		self.estudiante_id = estudiante_id
		self.actividad_id = actividad_id
		self.puntos = puntos
		self.estado = estado
		
	def __repr__(self):
		return "<Actividades_evaluativas_matricula (cohorte_id = ' % s ', categoria_id = ' % s ', estudiante_id = ' % s ', actividad_id = ' % s ', puntos = ' % s ', estado = ' % s ')>" % (
			self.cohorte_id, self.categoria_id, self.estudiante_id, self.actividad_id, self.puntos, self.estado)

class Actividades_formativas_matricula(Base):
	__tablename__ = 'actividades_formativas_matricula'

	cohorte_id = Column(String(10), ForeignKey('cohorte.id_cohorte', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	categoria_id =  Column(String(10), ForeignKey('categoria.id_categoria', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	estudiante_id = Column(String(10), ForeignKey('estudiante.num_identificacion', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	actividad_id =  Column(String(10), ForeignKey('actividad_formativa.id_actividad_formativa', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	estado = Column(Boolean, default=False)

	def __init__(self, cohorte_id, categoria_id, estudiante_id, actividad_id, estado):

		self.cohorte_id = cohorte_id
		self.categoria_id = categoria_id
		self.estudiante_id = estudiante_id
		self.actividad_id = actividad_id
		self.estado = estado
		
	def __repr__(self):
		return "<Actividades_formativas_matricula (cohorte_id = ' % s ', categoria_id = ' % s ', estudiante_id = ' % s ', actividad_id = ' % s ', estado = ' % s ')>" % (
			self.cohorte_id, self.categoria_id, self.estudiante_id, self.actividad_id, self.estado)
 
class Material_de_ayuda_actividad(Base):
	__tablename__ = 'material_de_ayuda_actividad'

	material_ap_id = Column(String(10), ForeignKey('material_de_ayuda.id_material_de_ayuda', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	actividad_id =  Column(String(10), ForeignKey('actividad_evaluativa.id_actividad_evaluativa', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
	estado = Column(Boolean, default=True)

	def __init__(self, cohorte_id, actividad_id, estado):

		self.material_ap_id = material_ap_id
		self.actividad_id = actividad_id
		self.estado = estado

	def __repr__(self):
		return "<Material_de_ayuda_actividad (material_ap_id = ' % s ', actividad_id = ' % s ', estado = ' % s ')>" % (
			self.material_ap_id, self.actividad_id, self.estado)	


if __name__ == '__main__':
	
	engine = create_engine('postgresql://postgres:postgres@localhost:5432/soyciudadanotic')
	Base.metadata.create_all(engine)