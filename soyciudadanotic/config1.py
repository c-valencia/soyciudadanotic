from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from model import *


class ConexionBD():
    conexion = None

    def getConexion(self):
        if(self.conexion == None):
            engine = create_engine('postgresql://postgres:postgres@localhost:5432/soyciudadanotic')
            Session = sessionmaker(bind=engine)
            self.conexion = Session()
            print("la conexion fue exitosa")
        return (self.conexion)