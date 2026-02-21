from pydantic import BaseModel, Field


class RegisterModel(BaseModel):
	email: str = Field(min_length=3, max_length=120)
	password: str = Field(min_length=6, max_length=128)


class LoginModel(BaseModel):
	email: str = Field(min_length=3, max_length=120)
	password: str = Field(min_length=6, max_length=128)
