from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from model import *



class ConexionBD():
    conexion = None

    def getConexion(self):
        #engine = create_engine('postgresql://postgres:1234@localhost:5432/soyciudadanotic')
			engine = create_engine('postgresql://administrador:admin@localhost:5432/soytic')
            Session = sessionmaker(bind=engine)
            self.conexion = Session()
            print("la conexion fue exitosa")
        return (self.conexion)