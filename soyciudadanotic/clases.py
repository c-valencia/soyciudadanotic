class Ra_estado(): 
    def __init__(self, ra_id, descripcion, nivel, estado):
        self.ra_id = ra_id
        self.descripcion = descripcion
        self.nivel = nivel
        self.estado = estado

    ra_id = "" 
    descripcion = ""
    nivel = 0 
    estado = False 
    
class Actividad_estado(): 
    def __init__(self, ra_id, actividad, secuencia, descripcion, estado):
    	self.ra_id = ra_id
    	self.actividad = actividad
    	self.secuencia = secuencia
    	self.descripcion = descripcion
    	self.estado = estado

    ra_id = ""
    actividad = ""
    secuencia = "" 
    descripcion = "" 
    estado = False 