from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from model import *
some_engine = create_engine('postgresql://postgres:postgres@localhost:5432/soyciudadanotic')
Session = sessionmaker(bind=some_engine)
session = Session()

Base = declarative_base()



u = Usuario()
u.login = 'user3'
session.add(u)
session.commit()
