package ve.gob.cne.sarc.persistencia.entidades;

import ve.gob.cne.sarc.persistencia.anotaciones.ClassEspecification;
import ve.gob.cne.sarc.persistencia.anotaciones.FieldEspecification;
import ve.gob.cne.sarc.persistencia.disparadores.SolicitudEstatusDisparador;

import javax.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * SolicitudEstatusEntidad.java
 *
 * @author Oscar Montilla
 * @version 1.0 11/08/2016
 * @descripcion Se crea la clase SolicitudEstatusEntidad donde se Realizan los Query de consulta de cada metodo
 * @author Oscar Montilla
 * @version 1.0 07/09/2016
 */
@Entity
@Table(name = "C043T_SOLICITUD_ESTATUS")
@EntityListeners({SolicitudEstatusDisparador.class})
@ClassEspecification(name = "Estatus de Solicitud", identifier = "Nombre", canBeListed = true,
        generatesTask = ClassEspecification.SincronizationPolicy.BROADCAST)
public class SolicitudEstatusEntidad implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Basic(optional = false)
    @Column(name = "CO_SOLICITUD_ESTATUS", nullable = false, length = 22)
    @SequenceGenerator(name = "SOLICITUD_ESTATUS_SEQ", sequenceName = "C043S_CO_SOLICITUD_ESTATUS", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SOLICITUD_ESTATUS_SEQ")
    @FieldEspecification(type = "java.lang.Long", hide = true, order = 0, step = 0)
    private long id;

    @Basic(optional = true)
    @Column(name = "IDEN_SOLICITUD_ESTATUS", unique = true, nullable = false, length = 5)
    @FieldEspecification(size = 5, required = true, label = "C&oacute;digo", order = 1, step = 0, placeHolder = "Ejemplo: AAA00")
    private String codigo;

    @Basic(optional = true)
    @Column(name = "TX_DESCRIPCION", nullable = true, length = 200)
    @FieldEspecification(size = 200, input = FieldEspecification.InputType.TEXTAREAINPUT, label = "Descripci&oacute;n")
    private String descripcion;

    @Temporal(TemporalType.DATE)
    @Basic(optional = false)
    @Column(name = "FE_INICIO", nullable = false)
    private Date fechaInicio;

    @Temporal(TemporalType.DATE)
    @Basic(optional = true)
    @Column(name = "FE_FIN", nullable = true)
    private Date fechaFin;

    @Basic(optional = false)
    @Column(name = "NB_SOLICITUD_ESTATUS", nullable = false, length = 50)
    @FieldEspecification(size = 50, required = true, label = "Nombre", order = 2, step = 0)
    private String nombre;

    @Basic(optional = false)
    @Column(name = "TX_CODIGO_SINCRONIZACION", nullable = false, length = 256)
    @FieldEspecification(hide = true, label = "C&oacute;digo de sincronizaci&oacute;n", size = 255) 
    private String codigoSincronizacion;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "estatus", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<SolicitudEntidad> solicitud = new ArrayList<>();

    public SolicitudEstatusEntidad() {
        // Metodo Constructor
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Date getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(Date fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public List<SolicitudEntidad> getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(List<SolicitudEntidad> solicitud) {
        this.solicitud = solicitud;
    }

    public String getCodigoSincronizacion() {
        return codigoSincronizacion;
    }

    public void setCodigoSincronizacion(String codigoSincronizacion) {
        this.codigoSincronizacion = codigoSincronizacion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SolicitudEstatusEntidad that = (SolicitudEstatusEntidad) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}
